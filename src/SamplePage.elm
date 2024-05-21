module SamplePage exposing (..)

import Date exposing (fromOrdinalDate)
import Html.Styled exposing (button, code, div, p, text)
import Html.Styled.Events exposing (onClick)
import Platform.Cmd
import Types exposing (BlogPost)


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, Platform.Cmd.none )

        Decrement ->
            ( model - 1, Platform.Cmd.none )


type alias Model =
    Int


testPostPleaseIgnore : BlogPost Msg Model
testPostPleaseIgnore =
    { title = "Blah blah blah: words on a page"
    , publicationDate = fromOrdinalDate 2024 141
    , update = update
    , init = 0
    , view =
        \model ->
            div []
                [ p [] [ button [ onClick Decrement ] [ text "-" ] ]
                , p [] [ text (String.fromInt model) ]
                , p [] [ button [ onClick Increment ] [ text "+" ] ]
                , p [] [ text "here are some words for my imaginary document. maybe they will become meaningful someday. very cool very cool. why don't the cats allow the bats a smidge of fun? Cause the cats are really rats and they all really hate the sun. Away with ye olde beast. Your foul eyes that linger shall not cause me a pain." ]
                , code [] [ text "const just = x => r => r.just(x)" ]
                ]
    }
