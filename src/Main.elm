module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Events exposing (onKeyDown)
import Browser.Navigation as Navigation
import Char exposing (toLower)
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Date exposing (Date, format)
import Html.Styled exposing (Html, a, button, div, h1, i, input, text, toUnstyled)
import Html.Styled.Attributes exposing (css, href, placeholder, style, tabindex, value)
import Html.Styled.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
import List exposing (map, singleton)
import Navigation exposing (navigationPage)
import SamplePage exposing (Model, Msg(..), testPostPleaseIgnore)
import Types exposing (..)
import Url exposing (Url)


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


type SitewideMsg
    = NavigationMessage ()
    | SamplePageMessage Msg
    | UrlRequest UrlRequest
    | UrlChange Url
    | Toggle
    | CommandBarChanged String
    | CommandSubmitted


type PageModel
    = NavigationModel ()
    | SamplePageModel Model


type alias SitewideModel =
    { pageModel : PageModel, commandText : String }


init : flags -> Url.Url -> Navigation.Key -> ( SitewideModel, Cmd msg )
init =
    always << always << always ( { pageModel = NavigationModel navigationPage.init, commandText = "" }, Cmd.none )


tupleBroadcast : (a -> b) -> (c -> d) -> ( a, c ) -> ( b, d )
tupleBroadcast f g ( x, y ) =
    ( f x, g y )


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update message model =
    case ( message, model.pageModel ) of
        ( NavigationMessage msg, NavigationModel mod ) ->
            tupleBroadcast (\m -> { model | pageModel = NavigationModel m }) (Cmd.map NavigationMessage) (navigationPage.update msg mod)

        ( SamplePageMessage msg, SamplePageModel mod ) ->
            tupleBroadcast (\m -> { model | pageModel = SamplePageModel m }) (Cmd.map SamplePageMessage) (testPostPleaseIgnore.update msg mod)

        ( Toggle, SamplePageModel _ ) ->
            ( { model | pageModel = NavigationModel navigationPage.init }, Cmd.none )

        ( Toggle, NavigationModel _ ) ->
            ( { model | pageModel = SamplePageModel testPostPleaseIgnore.init }, Cmd.none )

        ( CommandBarChanged t, _ ) ->
            ( { model | commandText = t }, Cmd.none )

        ( CommandSubmitted, _ ) ->
            let
                ( newModel, _ ) =
                    if String.map toLower model.commandText == "toggle" then
                        update Toggle model

                    else
                        ( model, Cmd.none )
            in
            ( { newModel | commandText = "" }, Cmd.none )

        _ ->
            ( model, Cmd.none )


view : SitewideModel -> Document SitewideMsg
view m =
    { title = "SLR"
    , body =
        [ toUnstyled
            (case m.pageModel of
                NavigationModel _ ->
                    viewPage navPageAlt m

                SamplePageModel _ ->
                    viewBlogPost testPostAlt m
            )
        ]
    }


navPageAlt : Page SitewideMsg SitewideModel
navPageAlt =
    { update = update
    , view =
        \swmodel ->
            case swmodel.pageModel of
                NavigationModel m ->
                    Html.Styled.map NavigationMessage (navigationPage.view m)

                _ ->
                    div [] []
    , init = { pageModel = NavigationModel navigationPage.init, commandText = "" }
    }


testPostAlt : BlogPost SitewideMsg SitewideModel
testPostAlt =
    { update = update
    , view =
        \swmodel ->
            case swmodel.pageModel of
                SamplePageModel m ->
                    Html.Styled.map SamplePageMessage (testPostPleaseIgnore.view m)

                _ ->
                    div [] []
    , init = { pageModel = SamplePageModel testPostPleaseIgnore.init, commandText = "" }
    , title = testPostPleaseIgnore.title
    , publicationDate = testPostPleaseIgnore.publicationDate
    }


viewPage : Page SitewideMsg SitewideModel -> SitewideModel -> Html SitewideMsg
viewPage page model =
    wrapBody model [ page.view model ]


viewBlogPost : BlogPost SitewideMsg SitewideModel -> SitewideModel -> Html SitewideMsg
viewBlogPost blogPost model =
    wrapBody model [ viewHeading blogPost.title blogPost.publicationDate, blogPost.view model ]


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
                , tabindex -1 -- prevent text box from being tab selected. helps keep it hidden
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


viewHeading : String -> Date -> Html msg
viewHeading title publicationDate =
    div [ css [ textAlign center, width (pct 80), margin3 (em 1.2) auto (em 2.8) ] ]
        [ h1 [ css [ margin3 (em 2.3) (em 0) (em 1.1) ], style "text-wrap" "balance" ] [ text title ]
        , i [ css [] ] [ text (format "MMMM d, y" publicationDate) ]
        ]


wrapBody : SitewideModel -> List (Html SitewideMsg) -> Html SitewideMsg
wrapBody model b =
    div [ defaultStyles, css [ margin auto, width (em 30), fontSize large ] ] (navBar model :: b)
