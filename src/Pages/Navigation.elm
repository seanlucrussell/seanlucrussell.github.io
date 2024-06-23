module Pages.Navigation exposing (..)

import Components exposing (heading)
import Css exposing (center, em, fontFamilies, fontSize, pct, right, textAlign, width)
import Date exposing (Date, format)
import Html.Styled exposing (Html, a, article, div, h2, i, p, table, td, text, tr)
import Html.Styled.Attributes exposing (css, href)
import List exposing (map, sortWith)
import Pages.GameOfLife
import Pages.RecursionSchemes
import Pages.TheGutsOfGit
import Sitewide.Types exposing (Article)


navigationPage : Html msg
navigationPage =
    article []
        [ heading (text "Navigation")
        , p []
            [ text "My name is Sean Luc Russell. Remember the name, for it shall soon spread across the lands and all shall sing my praises. You are a visitor to my website. Welcome."
            ]
        , h2 [] [ text "Bio" ]
        , p [] [ text "Ahh who am I? Born in MI, moved to CO when young. Studied CS and minored in math. Should have majored in math, but didn't realize how much I liked it till too late. Took all the AI courses I could in college, including one graduate course. Ended up being in charge of the whole group even though I was the only undergrad there (perhaps the only undergrad in the whole course)" ]
        , p [] [ text "TBH my interests are all over the place, so I'm not going to pretend to be exhaustive. My main goal in life is to be right about everything all the time, which means that I have to know a lot of things. It's a work in progress. So rather than write a misleading bio that gives you an entirely too narrow view of who I am, I'll let you read the random nonsense I write and come to your own conclusions about my true nature." ]
        , p [] [ text "I am a man of modest ambition. All I want is to be right about everything all of the time." ]
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
    tr [] [ td [] [ a [ href pageInfo.primaryUrl ] [ text pageInfo.title ] ], td [ css [ textAlign right ] ] [ text (format "MMM dd y" pageInfo.publicationDate) ] ]
