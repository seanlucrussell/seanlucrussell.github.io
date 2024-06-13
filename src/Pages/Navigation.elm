module Pages.Navigation exposing (..)

import Css exposing (center, em, fontFamilies, fontSize, pct, right, textAlign, width)
import Date exposing (Date, format)
import Html.Styled exposing (Html, a, article, div, h1, i, p, table, td, text, tr)
import Html.Styled.Attributes exposing (css, href)
import List exposing (map, sortWith)
import Pages.GameOfLife
import Pages.RecursionSchemes
import Pages.TheGutsOfGit
import Sitewide.Types exposing (Article)


navigationPage : Html msg
navigationPage =
    article []
        [ h1 [ css [ textAlign center ] ] [ text "Navigation" ]
        , p []
            [ text "WIP"
            ]
        , table
            [ css [ fontFamilies [ "courier" ], width (pct 100) ] ]
            (map navRow pageList)
        , div [ css [ textAlign center ] ] [ i [ css [ fontSize (em 0.8) ] ] [ text "fig 1.1: Random blog posts" ] ]
        ]


type alias PageInfo =
    { url : String, title : String, publicationDate : Date }


pageList : List Article
pageList =
    sortWith (\r s -> Date.compare s.publicationDate r.publicationDate)
        [ Pages.TheGutsOfGit.article
        , Pages.GameOfLife.article
        , Pages.RecursionSchemes.article
        ]


navRow : Article -> Html msg
navRow pageInfo =
    tr [] [ td [] [ a [ href pageInfo.primaryUrl ] [ text pageInfo.title ] ], td [ css [ textAlign right ] ] [ text (format "MMM d y" pageInfo.publicationDate) ] ]
