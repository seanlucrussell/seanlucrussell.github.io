module Types exposing (..)

import Date exposing (Date)
import Html.Styled exposing (Html)


type alias Page msg model =
    { update : msg -> model -> ( model, Cmd msg )
    , view : model -> Html msg
    , init : model
    }


type alias BlogPost msg model =
    PreBlogPost (Page msg model)


type alias PreBlogPost page =
    { page | title : String, publicationDate : Date }
