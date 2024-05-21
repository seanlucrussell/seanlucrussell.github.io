module Navigation exposing (..)

import Html.Styled exposing (div, text)
import Types exposing (Page)


navigationPage : Page () ()
navigationPage =
    { view = always (div [] [ text "welcome" ])
    , update = always <| always ( (), Cmd.none )
    , init = ()
    }
