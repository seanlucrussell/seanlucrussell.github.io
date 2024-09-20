-- pandoc-elm.lua
local stringify = pandoc.utils.stringify

-- Helper function to escape Elm strings
local function escape_elm(str)
  return str:gsub("\\","\\\\"):gsub('"', '\\"'):gsub("\n", "\\n")
end

-- Function to convert inline elements to Elm code
local function inline_to_elm(inlines)
  local buffer = {}
  local current_text = {}

  local function flush_text()
    if #current_text > 0 then
      table.insert(buffer, 'text "' .. escape_elm(table.concat(current_text, "")) .. '"')
      current_text = {}
    end
  end

  for _, inline in ipairs(inlines) do
    if inline.t == "Str" then
      table.insert(current_text, inline.text)
    elseif inline.t == "Space" then
      table.insert(current_text, " ")
    elseif inline.t == "Math" then
      flush_text()
      table.insert(buffer, 'node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool False ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "' .. escape_elm(inline.text) .. '"] []')
    elseif inline.t == "Code" then
      flush_text()
      table.insert(buffer, 'code [] [ text "' .. escape_elm(inline.text) .. '" ]')
    elseif inline.t == "Emph" then
      flush_text()
      table.insert(buffer, 'em [] [ ' .. inline_to_elm(inline.content) .. ' ]')
    elseif inline.t == "Strong" then
      flush_text()
      table.insert(buffer, 'strong [] [ ' .. inline_to_elm(inline.content) .. ' ]')
    elseif inline.t == "Link" then
      flush_text()
      table.insert(buffer, 'a [ href "' .. inline.target .. '" ] [ ' .. inline_to_elm(inline.content) .. ' ]')
    elseif inline.t == "Plain" then
      table.insert(buffer, inline_to_elm(inline.content))
    elseif inline.t == "Quoted" then
      table.insert(current_text, '"')
      flush_text()
      table.insert(buffer, inline_to_elm(inline.content))
      table.insert(current_text, '"')
    else
      -- Add more inline element handlers as needed
    end
  end
  flush_text()
  return table.concat(buffer, ", ")
end

function li_prefix(isFirst)
  return isFirst and "    [ " or "    , "
end

function processBlock(i, block)
  if block.t == "Header" then
    return {', h' .. block.level .. ' [] [ ' .. inline_to_elm(block.content) .. ' ]'}
  elseif block.t == "BulletList" then
    local buffer = {}
    table.insert(buffer, ', ul []')
    local li_isFirst = true
    for j, item in ipairs(block.content) do
      table.insert(buffer, li_prefix(li_isFirst) .. 'li [] [ ' .. inline_to_elm(item) .. ' ]')
      li_isFirst = false
    end
    table.insert(buffer, '    ]')
    return buffer
  elseif block.t == "OrderedList" then
    local buffer = {}
    table.insert(buffer, ', ol []')
    local li_isFirst = true
    for j, item in ipairs(block.content) do
      table.insert(buffer, li_prefix(li_isFirst) .. 'li [] [ ' .. inline_to_elm(item) .. ' ]')
      li_isFirst = false
    end
    table.insert(buffer, '    ]')
    return buffer
  elseif block.t == "CodeBlock" then
    local codeType = block.attr.classes[1]
    if codeType == 'sitecode' then
      return {', ' .. block.text}
    else
      return {', pre [] [ code [] [ text "' .. escape_elm(block.text) .. '" ] ]'}
    end
  elseif block.content[1].t == "Math" then
      return {', node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool True ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "' .. escape_elm(block.content[1].text) .. '"] []'}
  elseif block.content[1].t == "Plain" and #block.content[1].content == 1 then
    local image = block.content[1].content[1];
    return {', img [ src "' .. image.src .. '", alt "' .. stringify(image.caption) .. '" ] []'}
  elseif block.t == "Para" then
    return {', p [] [ ' .. inline_to_elm(block.content) .. ' ]'}
  else
    error("Unhandled block of type " .. block.t);
  end
  return buffer
end

local function meta_to_string(meta)
  local result = ""
  for k, v in pairs(meta) do
    result = result .. k .. ": " .. pandoc.utils.stringify(v) .. "\n"
  end
  return result
end

function ReadMetadata(doc)
  local metadata = {}
  metadata.date = 1000 * os.time()
  if doc.meta.date then
    local y, m, d = stringify(doc.meta.date):match("(%d+)%-(%d+)%-(%d+)")
    metadata.date = 1000 * os.time({year = y, month = m, day = d})
  end
  if not doc.meta.moduleName then
    error("Expecting a moduleName for the page in the metadata")
  end
  metadata.moduleName = stringify(doc.meta.moduleName)
  metadata.imports = {}
  if doc.meta.imports then
    for _, lib in ipairs(doc.meta.imports) do
      table.insert(metadata.imports, stringify(lib))
    end
  end
  if doc.meta.update then
    metadata.update = stringify(doc.meta.update)
  end
  if doc.meta.primaryUrl then
    metadata.primaryUrl = stringify(doc.meta.primaryUrl)
  else
    error("Expecting a primaryUrl for the page in the metadata")
  end
  -- ideally these parameters should be automatically detected from the document content itself, not loaded as metadata
  metadata.dynamic = doc.meta.dynamic
  metadata.math = doc.meta.math
  return metadata
end

-- Convert Pandoc document to Elm code
function Writer(doc, opts)
  local buffer = {}
  local metadata = ReadMetadata(doc)

  table.insert(buffer, 'module Pages.' .. metadata.moduleName .. ' exposing (..)')
  table.insert(buffer, '')
  local imports = {}
  table.insert(imports, 'import Components exposing (blogHeading)')
  table.insert(imports, 'import Date exposing (fromPosix)')
  table.insert(imports, 'import Html.Styled exposing (..)')
  table.insert(imports, 'import Html.Styled.Attributes exposing (..)')
  if metadata.math then 
    table.insert(imports, 'import Json.Encode as Encode')
  end
  table.insert(imports, 'import Sitewide.Types exposing (Article, Page)')
  table.insert(imports, 'import Time exposing (Month(..), millisToPosix, utc)')
  for _, lib in ipairs(metadata.imports) do
      table.insert(imports, 'import ' .. lib)
  end
  table.sort(imports)
  for i, import in ipairs(imports) do
    table.insert(buffer, import)
  end
  table.insert(buffer, '')
  table.insert(buffer, '')
  table.insert(buffer, 'page : Page')
  table.insert(buffer, 'page =')
  table.insert(buffer, '    { view =')
  if metadata.dynamic then 
    table.insert(buffer, '        \\model ->')
  else
    table.insert(buffer, '        \\_ ->')
  end
  table.insert(buffer, '            Html.Styled.article []')

  local title = ''

  for i, block in ipairs(doc.blocks) do
    if i == 1 then
      if block.t ~= "Header" or block.level ~= 1 then
        error("File should start with h1")
      end
      table.insert(buffer, '                [ blogHeading (' .. inline_to_elm(block.content) .. ') article.publicationDate');
      title = stringify(block)
    else
      for _, line in ipairs(processBlock(i, block)) do
        table.insert(buffer, '                ' .. line);
      end
    end
  end

  table.insert(buffer, '                ]')

  if metadata.update then
    table.insert(buffer, '    , update = ' .. metadata.update .. '')
  else
    table.insert(buffer, '    , update = \\_ model -> ( model, Cmd.none )')
  end
  table.insert(buffer, '    }')
  table.insert(buffer, '')
  table.insert(buffer, '')
  table.insert(buffer, 'article : Article')
  table.insert(buffer, 'article =')
  table.insert(buffer, '    { title = "' .. title ..'"')
  table.insert(buffer, '    , publicationDate = fromPosix utc (millisToPosix ' .. metadata.date .. ')')
  table.insert(buffer, '    , moduleName = "' .. metadata.moduleName ..'"')
  table.insert(buffer, '    , primaryUrl = "' .. metadata.primaryUrl .. '"')
  table.insert(buffer, '    }')


  return table.concat(buffer, '\n')
end

