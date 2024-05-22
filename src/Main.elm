module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Navigation
import Char exposing (toUpper)
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Dict exposing (Dict)
import Html.Styled exposing (Html, a, div, input, text, toUnstyled)
import Html.Styled.Attributes exposing (css, href, placeholder, style, tabindex, value)
import Html.Styled.Events exposing (on, onInput)
import Json.Decode as Decode
import List exposing (map, singleton)
import Navigation exposing (navigationPage)
import SamplePage
import Types exposing (..)
import Url exposing (Url)


init : flags -> Url -> Navigation.Key -> ( SitewideModel, Cmd msg )
init _ _ _ =
    ( { currentPage = NavigationPage
      , commandText = ""
      , samplePageModel = SamplePage.init
      }
    , Cmd.none
    )


commandMap : SitewideModel -> Dict String SitewideMsg
commandMap model =
    Dict.fromList
        [ ( "NAV", SelectPage NavigationPage )
        , ( "TEST", SelectPage SamplePage )
        , ( "TOGGLE"
          , SelectPage
                (if model.currentPage == NavigationPage then
                    SamplePage

                 else
                    NavigationPage
                )
          )
        ]


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update message model =
    case message of
        SelectPage p ->
            ( { model | currentPage = p }, Cmd.none )

        CommandBarChanged t ->
            ( { model | commandText = t }, Cmd.none )

        CommandSubmitted ->
            case Dict.get (String.map toUpper model.commandText) (commandMap model) of
                Just cmd ->
                    update cmd { model | commandText = "" }

                Nothing ->
                    ( { model | commandText = "" }, Cmd.none )

        _ ->
            case model.currentPage of
                SamplePage ->
                    onFirst (\m -> { model | samplePageModel = m }) (SamplePage.update message model.samplePageModel)

                _ ->
                    ( model, Cmd.none )


onFirst : (a -> b) -> ( a, c ) -> ( b, c )
onFirst f ( a, b ) =
    ( f a, b )


pageView : SitewideModel -> Page -> Html SitewideMsg
pageView m page =
    case page of
        NavigationPage ->
            navigationPage

        SamplePage ->
            SamplePage.view m.samplePageModel


view : SitewideModel -> Document SitewideMsg
view m =
    { title = "SLR"
    , body = [ toUnstyled (div [ defaultStyles, css [ margin auto, width (em 30), fontSize large ] ] [ navBar m, pageView m m.currentPage ]) ]
    }


defaultStyles : Html.Styled.Attribute msg
defaultStyles =
    css
        [ descendants [ typeSelector "code" [ color (rgb 100 100 100) ] ]
        ]


navPanelSideWidth : Em
navPanelSideWidth =
    em 8


makeSidePanel : List (Html msg) -> List (Html msg)
makeSidePanel =
    map (div [] << singleton)


navBar : SitewideModel -> Html SitewideMsg
navBar model =
    div [ css [ displayFlex, flexDirection row, fontFamilies [ "courier" ], marginBottom (em 1.2) ] ]
        [ div [ css [ width navPanelSideWidth ] ] (makeSidePanel [ text "SLR", text "LOCAL BUILD" ])
        , div [ css [ flexGrow (num 1) ] ]
            [ input
                -- invisible box
                [ css
                    [ border (em 0)
                    , opacity (num 0) -- hide text unless selected
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
                [ a [ href "http://seanlucrussell.com" ] [ text "NAVIGATION" ]
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


main : Program () SitewideModel SitewideMsg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }
