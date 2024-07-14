module Sitewide.Update exposing (..)

import Browser exposing (UrlRequest(..))
import Browser.Navigation as Navigation
import Char exposing (toUpper)
import Css exposing (..)
import Dict exposing (Dict)
import Sitewide.Routes exposing (urlMap)
import Sitewide.Types exposing (..)


commandMap : SitewideModel -> Dict String SitewideMsg
commandMap _ =
    Dict.fromList
        [ ( "NAV", SelectPage "/NAV" )
        , ( "REC", SelectPage "/REC" )
        , ( "GOG", SelectPage "/GOG" )
        , ( "LIFE", SelectPage "/LIFE" )
        , ( "CLOCK", ToggleClock )
        , ( "MSG", ToggleContactForm )
        ]


intervalCount : Float -> Float -> Int
intervalCount time intervalDuration =
    floor (time / intervalDuration)


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update message model =
    case message of
        SelectPage p ->
            ( { model | currentPage = p }, Navigation.pushUrl model.key p )

        UrlChange url ->
            ( { model | currentPage = url.path }, Cmd.none )

        UrlRequest (Internal url) ->
            update (SelectPage url.path) model

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

        ToggleClock ->
            ( { model | clockIsVisible = not model.clockIsVisible }, Cmd.none )

        ToggleContactForm ->
            ( { model | contactInfoIsVisible = not model.contactInfoIsVisible }, Cmd.none )

        Tick t ->
            if intervalCount (model.time + t) 100 - intervalCount model.time 100 >= 1 then
                update GameOfLifeStep { model | time = model.time + t }

            else
                ( { model | time = model.time + t }, Cmd.none )

        _ ->
            (urlMap model.currentPage).update message model
