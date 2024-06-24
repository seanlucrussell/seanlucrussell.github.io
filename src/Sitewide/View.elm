module Sitewide.View exposing (..)

import Browser exposing (Document, UrlRequest(..))
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Css.Media exposing (only, screen, withMedia)
import Css.Transitions as Transitions exposing (transition)
import Html.Styled exposing (Attribute, Html, a, div, header, input, main_, span, text, toUnstyled)
import Html.Styled.Attributes exposing (css, href, placeholder, style, value)
import Html.Styled.Events exposing (keyCode, on, onClick, onInput)
import Json.Decode as Decode
import List exposing (map, singleton)
import Sitewide.Routes exposing (urlMap)
import Sitewide.Types exposing (..)


view : SitewideModel -> Document SitewideMsg
view m =
    { title = "SLR"
    , body =
        [ toUnstyled
            (main_
                [ defaultStyles
                , css
                    [ margin auto
                    , withMedia [ only screen [ Css.Media.minWidth (px 660) ] ] [ width (em 34) ]
                    , fontSize (rem 1.13)
                    , width (pct 93)
                    ]
                ]
                [ navBar m
                , div
                    [ css
                        [ transition [ Transitions.height 300 ]
                        , height
                            (em
                                (if m.contactInfoIsVisible then
                                    2

                                 else
                                    0
                                )
                            )
                        , overflow hidden
                        , margin auto
                        , textAlign center
                        , fontFamilies [ "courier" ]

                        -- , textAlign right
                        ]
                    ]
                    [ text "EMAIL ME AT ", a [ href "mailto:seanlucrussell@gmail.com" ] [ text "seanlucrussell@gmail.com" ] ]
                , (urlMap m.currentPage).view m
                ]
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
                , fontSize (em 0.9)
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
    map (div [ css [ padding2 (em 0.1) (em 0) ] ] << singleton)


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

                -- disabling during development bc this is actually really useful for sending commands
                --, tabindex -1 -- prevent text box from being tab selected. helps keep it hidden
                , placeholder "ENTER COMMAND"
                ]
                []
            ]
        , div [ css [ width navPanelSideWidth, textAlign right ] ]
            (makeSidePanel
                [ a [ href "/NAV" ] [ text "NAVIGATION" ]
                , a [ onClick ToggleContactForm, href "#" ]
                    [ text
                        (if model.contactInfoIsVisible then
                            "HIDE"

                         else
                            "CONTACT"
                        )
                    ]
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
