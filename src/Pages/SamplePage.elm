module Pages.SamplePage exposing (..)

import Components exposing (blogHeading)
import Date exposing (fromOrdinalDate)
import Html.Styled exposing (Html, button, code, div, p, text)
import Html.Styled.Events exposing (onClick)
import List exposing (map, singleton)
import Sitewide.Types exposing (SampleModel, SitewideModel, SitewideMsg(..))


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update msg model =
    ( case msg of
        Increment ->
            { model | samplePageModel = model.samplePageModel + 1 }

        Decrement ->
            { model | samplePageModel = model.samplePageModel - 1 }

        _ ->
            model
    , Cmd.none
    )


init : SampleModel
init =
    0


view : SampleModel -> Html SitewideMsg
view model =
    div []
        (blogHeading (text "Blah blah blah: words on a page") (fromOrdinalDate 2024 141)
            :: map (p [] << singleton)
                [ button [ onClick Decrement ] [ text "- Dec" ]
                , text (String.fromInt model)
                , button [ onClick Increment ] [ text "+ Inc" ]
                , text "here are some words for my imaginary document. maybe they will become meaningful someday. very cool very cool. why don't the cats allow the bats a smidge of fun? Cause the cats are really rats and they all really hate the sun. Away with ye olde beast. Your foul eyes that linger shall not cause me a pain."
                , code [] [ text "const just = x => r => r.just(x)" ]
                ]
        )
