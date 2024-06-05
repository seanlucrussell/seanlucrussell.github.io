module Sitewide.Types exposing (..)

import Browser exposing (UrlRequest)
import Browser.Navigation exposing (Key)
import Extra.GameOfLife.GameOfLife exposing (Board)
import Url exposing (Url)


type alias SitewideModel =
    { commandText : String
    , samplePageModel : SampleModel
    , currentPage : Page
    , key : Key
    , gameOfLifeBoard : Extra.GameOfLife.GameOfLife.Board
    }


type alias SampleModel =
    Int


type Page
    = NavigationPage
    | SamplePage
    | MissingPage
    | RecursionSchemesPage
    | GutsOfGitPage
    | GameOfLifePage


type SitewideMsg
    = Increment
    | Decrement
    | UrlRequest UrlRequest
    | UrlChange Url
    | SelectPage Page
    | CommandBarChanged String
    | CommandSubmitted
    | SleepComplete
    | LoadBoard Board
