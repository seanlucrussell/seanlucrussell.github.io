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

function line_prefix(isFirst)
    if isFirst then
      return "        [ "
    end
    return "        , "
end

function li_prefix(isFirst)
  if isFirst then
      return "            [ "
    end
    return "            , "
end

-- Convert Pandoc document to Elm code
function Writer(doc, opts)
  local buffer = {}

  local date = 1000 * os.time()

  if doc.meta.title then
    table.insert(buffer, 'module Pages.' .. doc.meta.title .. ' exposing (..)')
  else
    table.insert(buffer, 'module Pages._ exposing (..)')
  end
  table.insert(buffer, '')
  table.insert(buffer, 'import Components exposing (blogHeading)')
  table.insert(buffer, 'import Date exposing (fromPosix)')
  table.insert(buffer, 'import Html.Styled exposing (..)')
  table.insert(buffer, 'import Html.Styled.Attributes exposing (..)')
  table.insert(buffer, 'import Time exposing (Month(..), millisToPosix, utc)')
  table.insert(buffer, '')
  table.insert(buffer, '')
  table.insert(buffer, 'view : Html msg')
  table.insert(buffer, 'view =')
  table.insert(buffer, '    article []')

  local isFirst = true

  for i, block in ipairs(doc.blocks) do
    if block.t == "Para" then
      table.insert(buffer, line_prefix(isFirst) .. 'p [] [ ' .. inline_to_elm(block.content) .. ' ]')
    elseif block.t == "Header" then
      local level = block.level
      local content = inline_to_elm(block.content)
      if level == 1 then
        table.insert(buffer, line_prefix(isFirst) .. 'blogHeading (' .. content .. ') (fromPosix utc (millisToPosix ' .. date .. '))');
      else
        table.insert(buffer, line_prefix(isFirst) .. 'h' .. level .. ' [] [ ' .. content .. ' ]')
      end
    elseif block.t == "BulletList" then
      table.insert(buffer, line_prefix(isFirst) .. 'ul []')
      local li_isFirst = true
      for j, item in ipairs(block.content) do
        table.insert(buffer, li_prefix(li_isFirst) .. 'li [] [ ' .. inline_to_elm(item) .. ' ]')
        li_isFirst = false
      end
      table.insert(buffer, '            ]')
    elseif block.t == "OrderedList" then
      table.insert(buffer, line_prefix(isFirst) .. 'ol []')
      local li_isFirst = true
      for j, item in ipairs(block.content) do
        table.insert(buffer, li_prefix(li_isFirst) .. 'li [] [ ' .. inline_to_elm(item) .. ' ]')
        li_isFirst = false
      end
      table.insert(buffer, '            ]')
    elseif block.t == "CodeBlock" then
      local content = escape_elm(block.text)
      table.insert(buffer, line_prefix(isFirst) .. 'pre [] [ code [] [ text "' .. content .. '" ] ]')
    elseif block.t == "Figure" and #block.content == 1 and block.content[1].t == "Plain" and #block.content[1].content == 1 then
      local image = block.content[1].content[1];
      table.insert(buffer, line_prefix(isFirst) .. 'img [ src "' .. image.src .. '" , alt "' .. stringify(image.caption) .. '" ] []');
    else
      error("Unhandled block of type " .. block.t);
    end
    isFirst = false
  end

  table.insert(buffer, '        ]')

  return table.concat(buffer, '\n')
end

