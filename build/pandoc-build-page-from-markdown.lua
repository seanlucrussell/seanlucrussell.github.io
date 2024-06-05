-- pandoc-elm.lua
local stringify = pandoc.utils.stringify

-- Helper function to escape Elm strings
local function escape_elm(str)
  return str:gsub('"', '\\"'):gsub("\n", "\\n")
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
    -- Add more inline element handlers as needed
    end
  end
  flush_text()
  return table.concat(buffer, ", ")
end

function li_prefix(isFirst)
  if isFirst then
      return "    [ "
    end
    return "    , "
end

function processBlock(i, block)

  if block.t == "Para" then
    return {', p [] [ ' .. inline_to_elm(block.content) .. ' ]'}
  elseif block.t == "Header" then
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
  elseif block.content[1].t == "Plain" and #block.content[1].content == 1 then
    local image = block.content[1].content[1];
    return {', img [ src "' .. image.src .. '", alt "' .. stringify(image.caption) .. '" ] []'}
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

-- Convert Pandoc document to Elm code
function Writer(doc, opts)
  local buffer = {}
  local date = 1000 * os.time()

  if doc.meta.title then
    table.insert(buffer, 'module Pages.' .. stringify(doc.meta.title) .. ' exposing (..)')
  else
    table.insert(buffer, 'module Pages._ exposing (..)')
  end
  table.insert(buffer, '')
  local imports = {}
  table.insert(imports, 'import Components exposing (blogHeading)')
  table.insert(imports, 'import Date exposing (fromPosix)')
  table.insert(imports, 'import Html.Styled exposing (..)')
  table.insert(imports, 'import Html.Styled.Attributes exposing (..)')
  if doc.meta.dynamic then 
    table.insert(imports, 'import Sitewide.Types exposing (SitewideModel, SitewideMsg)')
  end
  table.insert(imports, 'import Time exposing (Month(..), millisToPosix, utc)')
  for _, lib in ipairs(doc.meta.imports) do
    table.insert(imports, 'import ' .. stringify(lib))
  end
  table.sort(imports)
  for i, import in ipairs(imports) do
    table.insert(buffer, import)
  end
  table.insert(buffer, '')
  table.insert(buffer, '')
  if doc.meta.dynamic then 
    table.insert(buffer, 'view : SitewideModel -> Html SitewideMsg')
    table.insert(buffer, 'view model =')
  else
    table.insert(buffer, 'view : Html SitewideMsg')
    table.insert(buffer, 'view =')
  end
  table.insert(buffer, '    article []')

  for i, block in ipairs(doc.blocks) do
    if i == 1 then
      if block.t ~= "Header" or block.level ~= 1 then
        error("File should start with h1")
      end
      table.insert(buffer, '        [ blogHeading (' .. inline_to_elm(block.content) .. ') (fromPosix utc (millisToPosix ' .. date .. '))');
    else
      for _, line in ipairs(processBlock(i, block)) do
        table.insert(buffer, '        ' .. line);
      end
    end
  end

  table.insert(buffer, '        ]')

  return table.concat(buffer, '\n')
end

