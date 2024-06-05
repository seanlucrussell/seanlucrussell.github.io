module Sitewide.Init exposing (..)

import Browser exposing (UrlRequest(..))
import Browser.Navigation exposing (Key)
import Extra.GameOfLife.App
import Pages.SamplePage
import Sitewide.Types exposing (..)
import Sitewide.Update exposing (update)
import Url exposing (Url)


init : flags -> Url -> Key -> ( SitewideModel, Cmd SitewideMsg )
init _ url key =
    update (UrlChange url)
        { key = key
        , currentPage = NavigationPage
        , commandText = ""
        , samplePageModel = Pages.SamplePage.init
        , gameOfLifeBoard = Extra.GameOfLife.App.initialBoard
        }
