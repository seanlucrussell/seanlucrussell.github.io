module Pages.Navigation exposing (..)

import Components exposing (heading)
import Css exposing (center, fontFamilies, pct, right, textAlign, width)
import Date exposing (Date, format)
import Html.Styled exposing (Html, a, article, h2, p, table, td, text, tr)
import Html.Styled.Attributes exposing (css, href, style)
import List exposing (map, sortWith)
import Pages.FunctionalLinearAlgebra
import Pages.FunctionalLinearAlgebraWithTypes
import Pages.GameOfLife
import Pages.RecursionSchemes
import Pages.TheGutsOfGit
import Sitewide.Types exposing (Article)


navigationPage : Html msg
navigationPage =
    article []
        [ heading (text "Navigation")
        , p [] [ text "Hi! Welcome! Come on in. Welcome to the personal website for Sean Luc Russell. Glad you found us." ]
        , p [] [ text "If this is your first time here let me show you around. At the top right of every page we have a navigation link. This will help you get back here. Use it if you get lost. We also have a contact link in case you want to send an email to Mr. Russell. And below we have a collection of all the publications on this blog, ordered chronologically." ]
        , p [] [ text "I can't tell you if we have what you are looking for here. I'm not sure myself what you might find in the pages below. The precise purpose of this site is a work in progress. But we are happy you are here, so stay as long as you'd like and have a look around. Who knows? Maybe you'll find something that interests you." ]
        , p [] [ text "Thanks for dropping in!" ]
        , h2 [ css [ textAlign center ] ] [ text "Pages" ]
        , table
            [ css [ fontFamilies [ "courier" ], width (pct 100) ] ]
            (map navRow pageList)
        ]


type alias PageInfo =
    { url : String, title : String, publicationDate : Date }


pageList : List Article
pageList =
    sortWith (\r s -> Date.compare s.publicationDate r.publicationDate)
        [ Pages.TheGutsOfGit.article
        , Pages.GameOfLife.article
        , Pages.RecursionSchemes.article
        , Pages.FunctionalLinearAlgebra.article
        , Pages.FunctionalLinearAlgebraWithTypes.article
        ]


navRow : Article -> Html msg
navRow pageInfo =
    tr [ style "text-wrap" "balance" ] [ td [] [ a [ href pageInfo.primaryUrl ] [ text pageInfo.title ] ], td [ css [ textAlign right ] ] [ text (format "MMM dd y" pageInfo.publicationDate) ] ]
