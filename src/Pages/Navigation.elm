module Pages.Navigation exposing (..)

import Css exposing (center, fontFamilies, textAlign)
import Html.Styled exposing (Html, a, div, h1, li, p, text, ul)
import Html.Styled.Attributes exposing (css, href)


navigationPage : Html msg
navigationPage =
    div []
        [ h1 [ css [ textAlign center ] ] [ text "Navigation" ]
        , p []
            [ text "WIP"
            ]
        , ul
            [ css [ fontFamilies [ "courier" ] ] ]
            [ li [] [ a [ href "/GOG" ] [ text "THE-GUTS-OF-GIT" ] ]
            , li [] [ a [ href "/LIFE" ] [ text "GAME-OF-LIFE" ] ]
            , li [] [ a [ href "/REC" ] [ text "RECURSION-SCHEMES" ] ]
            ]
        ]
