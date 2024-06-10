module Components exposing (..)

import Css exposing (..)
import Date exposing (Date, format)
import Html.Styled exposing (Html, div, h1, i, text)
import Html.Styled.Attributes exposing (css, style)


blogHeading : Html msg -> Date -> Html msg
blogHeading title publicationDate =
    div [ css [ textAlign center, width (pct 70), margin3 (em 1.2) auto (em 2.8) ] ]
        [ h1 [ css [ margin3 (em 2.3) (em 0) (em 1.1), fontSize (em 2.2) ], style "text-wrap" "balance" ] [ title ]
        , i [ css [] ] [ text (format "MMMM d, y" publicationDate) ]
        ]
