module Navigation exposing (..)

import Css exposing (center, textAlign)
import Html.Styled exposing (Html, a, div, h1, p, text)
import Html.Styled.Attributes exposing (css, href)


navigationPage : Html msg
navigationPage =
    div []
        [ h1 [ css [ textAlign center ] ] [ text "Navigation" ]
        , p []
            [ text "Welcome to my site. I don't have an about page because this whole site is about me. That's the plan anyhow. So yeah, here are all of my pages. You can look through them to figure out wtf I'm about."
            ]
        , p
            []
            [ a [ href "/SAMPLEPAGE" ] [ text "SAMPLE-PAGE" ]
            ]
        ]
