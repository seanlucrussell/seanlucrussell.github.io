module Sitewide.Update exposing (..)

import Browser exposing (UrlRequest(..))
import Browser.Navigation as Navigation
import Char exposing (toUpper)
import Css exposing (..)
import Dict exposing (Dict)
import Extra.GameOfLife.App
import List exposing (filter)
import Sitewide.Types exposing (..)
import Url exposing (Url)


commandMap : SitewideModel -> Dict String SitewideMsg
commandMap _ =
    Dict.fromList
        [ ( "NAV", SelectPage NavigationPage )
        , ( "REC", SelectPage RecursionSchemesPage )
        , ( "GOG", SelectPage GutsOfGitPage )
        , ( "LIFE", SelectPage GameOfLifePage )
        ]


urlPageRelation : List ( String, Page )
urlPageRelation =
    [ ( "/NAV", NavigationPage )
    , ( "/REC", RecursionSchemesPage )
    , ( "/GOG", GutsOfGitPage )
    , ( "/LIFE", GameOfLifePage )
    ]


urlToPage : Url -> Page
urlToPage url =
    case filter (\( u, _ ) -> u == url.path) urlPageRelation of
        ( _, page ) :: _ ->
            page

        _ ->
            MissingPage


pageToUrl : Page -> String
pageToUrl page =
    case filter (\( _, p ) -> p == page) urlPageRelation of
        ( url, _ ) :: _ ->
            url

        _ ->
            "/MISSING"


intervalCount : Float -> Float -> Int
intervalCount time intervalDuration =
    floor (time / intervalDuration)


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update message model =
    case message of
        SelectPage p ->
            ( { model | currentPage = p }, Navigation.pushUrl model.key (pageToUrl p) )

        UrlChange url ->
            ( { model | currentPage = urlToPage url }, Cmd.none )

        UrlRequest (Internal url) ->
            update (SelectPage (urlToPage url)) model

        UrlRequest (External url) ->
            ( model, Navigation.load url )

        CommandBarChanged t ->
            ( { model | commandText = t }, Cmd.none )

        CommandSubmitted ->
            case Dict.get (String.map toUpper model.commandText) (commandMap model) of
                Just cmd ->
                    update cmd { model | commandText = "" }

                Nothing ->
                    ( { model | commandText = "" }, Cmd.none )

        Tick t ->
            if intervalCount (model.time + t) 100 - intervalCount model.time 100 >= 1 then
                update GameOfLifeStep { model | time = model.time + t }

            else
                ( { model | time = model.time + t }, Cmd.none )

        _ ->
            case model.currentPage of
                GameOfLifePage ->
                    Extra.GameOfLife.App.update message model

                _ ->
                    ( model, Cmd.none )
