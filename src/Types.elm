module Types exposing (..)

import Browser exposing (UrlRequest)
import Url exposing (Url)


type alias SitewideModel =
    { commandText : String
    , samplePageModel : SampleModel
    , currentPage : Page
    }


type alias SampleModel =
    Int


type Page
    = NavigationPage
    | SamplePage


type SitewideMsg
    = Increment
    | Decrement
    | UrlRequest UrlRequest
    | UrlChange Url
    | SelectPage Page
    | CommandBarChanged String
    | CommandSubmitted
