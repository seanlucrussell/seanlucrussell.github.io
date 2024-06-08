module Pages.Missing exposing (..)

import Css exposing (center, textAlign)
import Html.Styled exposing (Html, a, div, h1, p, text)
import Html.Styled.Attributes exposing (css, href)


missing : Html msg
missing =
    div []
        [ h1 [ css [ textAlign center ] ] [ text "404" ]
        , p []
            [ text "This page does not exist. ", a [ href "NAV" ] [ text "Return to navigation?" ] ]
        ]
