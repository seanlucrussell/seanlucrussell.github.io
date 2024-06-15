module Sitewide.Types exposing (..)

import Browser exposing (UrlRequest)
import Browser.Navigation exposing (Key)
import Date exposing (Date)
import Extra.GameOfLife.GameOfLife exposing (Board)
import Html.Styled exposing (Html)
import Url exposing (Url)


type alias SitewideModel =
    { commandText : String
    , currentPage : String
    , key : Key
    , time : Float
    , clockIsVisible : Bool

    -- game of life
    , gameOfLifeBoard : Extra.GameOfLife.GameOfLife.Board
    }


type alias Page =
    { update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
    , view : SitewideModel -> Html SitewideMsg
    }


type alias Article =
    { primaryUrl : String
    , publicationDate : Date
    , title : String
    , moduleName : String
    }


type SitewideMsg
    = UrlRequest UrlRequest
    | UrlChange Url
    | SelectPage String
    | CommandBarChanged String
    | CommandSubmitted
    | Tick Float
    | ToggleClock
      -- game of life
    | GameOfLifeStep
    | LoadBoard Board
