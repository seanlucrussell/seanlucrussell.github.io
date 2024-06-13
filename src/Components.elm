module Components exposing (..)

import Css exposing (..)
import Date exposing (Date, format)
import Html.Styled exposing (Html, div, h1, i, text)
import Html.Styled.Attributes exposing (css, style)


blogHeading : Html msg -> Date -> Html msg
blogHeading title publicationDate =
    div []
        [ heading title
        , date publicationDate
        ]


heading : Html msg -> Html msg
heading title =
    div [ css [ margin3 (em 1.2) auto (em 2.8) ] ]
        [ h1 [ css [ textAlign center, width (pct 70), margin3 (em 2.3) auto (em 1.1), fontSize (em 2.2) ], style "text-wrap" "balance" ] [ title ]
        ]


date : Date -> Html msg
date d =
    div [ css [ textAlign center, width (pct 70), margin3 (em 1.2) auto (em 2.8) ] ] [ i [] [ text (format "MMMM d, y" d) ] ]
