module Sitewide.View exposing (..)

import Browser exposing (Document, UrlRequest(..))
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Css.Media exposing (landscape, only, orientation, portrait, screen, withMedia)
import Html.Styled exposing (Attribute, Html, a, div, header, input, main_, span, text, toUnstyled)
import Html.Styled.Attributes exposing (css, href, placeholder, style, value)
import Html.Styled.Events exposing (keyCode, on, onInput)
import Json.Decode as Decode
import List exposing (map, singleton)
import Pages.GameOfLife as GameOfLife
import Pages.Missing exposing (missing)
import Pages.Navigation exposing (navigationPage)
import Pages.RecursionSchemes as RecursionSchemes
import Pages.TheGutsOfGit as TheGutsOfGit
import Sitewide.Types exposing (..)


pageView : SitewideModel -> Page -> Html SitewideMsg
pageView m page =
    case page of
        NavigationPage ->
            navigationPage

        MissingPage ->
            missing

        RecursionSchemesPage ->
            RecursionSchemes.view

        GutsOfGitPage ->
            TheGutsOfGit.view

        GameOfLifePage ->
            GameOfLife.view m


view : SitewideModel -> Document SitewideMsg
view m =
    { title = "SLR"
    , body =
        [ toUnstyled
            (main_
                [ defaultStyles
                , css
                    [ margin auto
                    , withMedia [ only screen [ Css.Media.minWidth (px 800), orientation landscape ] ] [ width (em 34) ]
                    , withMedia [ only screen [ orientation portrait ] ] [ fontSize xxLarge ]
                    , fontSize large
                    , width (pct 78)
                    ]
                ]
                [ navBar m, pageView m m.currentPage ]
            )
        ]
    }


defaultStyles : Attribute msg
defaultStyles =
    css
        [ descendants
            [ typeSelector "code"
                [ color (rgb 100 100 100)
                , fontSize (em 0.8)
                ]
            , typeSelector "pre"
                [ overflow auto
                , width (pct 90)
                , backgroundColor (rgb 220 220 220)
                , padding2 (em 0.9) (pct 5)
                , borderRadius (em 0.4)
                ]
            , typeSelector "p"
                [ paddingTop (em 0.4)
                , paddingBottom (em 0.4)
                ]
            , typeSelector "svg"
                [ width (pct 90)
                , padding2 (em 1.4) (pct 5)
                ]
            , typeSelector "img"
                [ width (pct 90)
                , height auto
                , padding2 (em 1.4) (pct 5)
                ]
            , typeSelector "li"
                [ padding2 (em 0.3) (em 0)
                ]
            , typeSelector "article" [ paddingBottom (em 12) ]
            , typeSelector "button"
                [ borderWidth (px 1)
                , borderRadius (em 40)
                , fontFamilies [ "arial" ]
                , margin2 (em 0.4) (em 0.7)
                , padding2 (em 0.4) (em 1)
                , fontSize large
                , fontWeight (int 200)
                , borderStyle dashed
                , borderColor (hex "C0C0C0")
                , backgroundColor (hex "ffffffbb")
                , hover
                    [ backgroundColor (hex "ddddddbb")
                    , borderColor (hex "aaaaaa")
                    , borderStyle solid
                    ]
                ]
            ]
        ]


navPanelSideWidth : Em
navPanelSideWidth =
    em 8


makeSidePanel : List (Html msg) -> List (Html msg)
makeSidePanel =
    map (div [] << singleton)


navBar : SitewideModel -> Html SitewideMsg
navBar model =
    header [ css [ displayFlex, flexDirection row, fontFamilies [ "courier" ], marginBottom (em 1.2) ] ]
        [ div [ css [ width navPanelSideWidth ] ]
            (makeSidePanel
                [ text "SLR"
                , text "LOCAL BUILD"
                ]
                ++ (if model.clockIsVisible then
                        [ span []
                            [ text "CLOCK: ", span [ css [ color (rgb 220 220 220) ] ] [ text (String.fromFloat model.time) ] ]
                        ]

                    else
                        []
                   )
            )
        , div [ css [ flexGrow (num 1) ] ]
            [ input
                -- invisible box
                [ css
                    [ border (em 0)
                    , opacity
                        (num
                            (if model.commandText == "" then
                                0

                             else
                                1
                            )
                        )

                    -- hide text unless selected
                    , focus [ outline none, opacity (num 1) ]
                    , fontFamilies [ "courier" ]
                    , textTransform uppercase
                    , color (rgb 100 100 100)
                    , width (pct 100)
                    ]
                , value model.commandText
                , onInput CommandBarChanged
                , on "keydown" (Decode.map identity keyDecoder)
                , style "user-select" "none" -- prevent text box from being highlighted. helps keep it hidden

                -- disabling during development bc this is actually really useful for sendign commands
                --, tabindex -1 -- prevent text box from being tab selected. helps keep it hidden
                , placeholder "ENTER COMMAND"
                ]
                []
            ]
        , div [ css [ width navPanelSideWidth, textAlign right ] ]
            (makeSidePanel
                [ a [ href "NAV" ] [ text "NAVIGATION" ]
                , a [ href "http://seanlucrussell.com" ] [ text "MESSAGE" ]
                ]
            )
        ]


keyDecoder : Decode.Decoder SitewideMsg
keyDecoder =
    Decode.andThen
        (\keyCode ->
            if keyCode == 13 then
                Decode.succeed CommandSubmitted

            else
                Decode.fail "Not the Enter key"
        )
        (Decode.field "keyCode" Decode.int)
