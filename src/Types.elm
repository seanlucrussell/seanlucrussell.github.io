module Types exposing (..)

import Browser exposing (UrlRequest)
import Browser.Navigation exposing (Key)
import Url exposing (Url)


type alias SitewideModel =
    { commandText : String
    , samplePageModel : SampleModel
    , currentPage : Page
    , key : Key
    }


type alias SampleModel =
    Int


type Page
    = NavigationPage
    | SamplePage
    | MissingPage


type SitewideMsg
    = Increment
    | Decrement
    | UrlRequest UrlRequest
    | UrlChange Url
    | SelectPage Page
    | CommandBarChanged String
    | CommandSubmitted
