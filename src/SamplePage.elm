module SamplePage exposing (..)

import Components exposing (blogHeading)
import Date exposing (fromOrdinalDate)
import Html.Styled exposing (Html, button, code, div, p, text)
import Html.Styled.Events exposing (onClick)
import Types exposing (SampleModel, SitewideMsg(..))


update : SitewideMsg -> SampleModel -> ( SampleModel, Cmd SitewideMsg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, Cmd.none )

        Decrement ->
            ( model - 1, Cmd.none )

        _ ->
            ( model, Cmd.none )


init : SampleModel
init =
    0


view : SampleModel -> Html SitewideMsg
view model =
    div []
        [ blogHeading "Blah blah blah: words on a page" (fromOrdinalDate 2024 141)
        , p [] [ button [ onClick Decrement ] [ text "-" ] ]
        , p [] [ text (String.fromInt model) ]
        , p [] [ button [ onClick Increment ] [ text "+" ] ]
        , p [] [ text "here are some words for my imaginary document. maybe they will become meaningful someday. very cool very cool. why don't the cats allow the bats a smidge of fun? Cause the cats are really rats and they all really hate the sun. Away with ye olde beast. Your foul eyes that linger shall not cause me a pain." ]
        , code [] [ text "const just = x => r => r.just(x)" ]
        ]
