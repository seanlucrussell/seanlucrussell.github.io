module Missing exposing (..)

import Css exposing (center, textAlign)
import Html.Styled exposing (Html, div, h1, p, text)
import Html.Styled.Attributes exposing (css)


missing : Html msg
missing =
    div []
        [ h1 [ css [ textAlign center ] ] [ text "404" ]
        , p []
            [ text "This page does not exist" ]
        ]
