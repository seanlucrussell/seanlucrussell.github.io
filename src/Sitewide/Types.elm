module Sitewide.Types exposing (..)

import Browser exposing (UrlRequest)
import Browser.Navigation exposing (Key)
import Extra.GameOfLife.GameOfLife exposing (Board)
import Url exposing (Url)


type alias SitewideModel =
    { commandText : String
    , currentPage : Page
    , key : Key
    , gameOfLifeBoard : Extra.GameOfLife.GameOfLife.Board
    , time : Float
    }


type Page
    = NavigationPage
    | MissingPage
    | RecursionSchemesPage
    | GutsOfGitPage
    | GameOfLifePage


type SitewideMsg
    = UrlRequest UrlRequest
    | UrlChange Url
    | SelectPage Page
    | CommandBarChanged String
    | CommandSubmitted
    | GameOfLifeStep
    | LoadBoard Board
    | Tick Float
