module Sitewide.Routes exposing (..)

import Html.Styled exposing (Html)
import Pages.GameOfLife
import Pages.Missing
import Pages.Navigation
import Pages.RecursionSchemes
import Pages.TheGutsOfGit
import Platform.Cmd as Cmd
import Sitewide.Types exposing (Page, SitewideModel, SitewideMsg)


staticPage : (SitewideModel -> Html SitewideMsg) -> Page
staticPage pageView =
    { view = pageView, update = \_ model -> ( model, Cmd.none ) }


urlMap : String -> Page
urlMap s =
    case s of
        "/" ->
            staticPage (always Pages.Navigation.navigationPage)

        "/NAV" ->
            staticPage (always Pages.Navigation.navigationPage)

        "/GOG" ->
            Pages.TheGutsOfGit.page

        "/REC" ->
            Pages.RecursionSchemes.page

        "/LIFE" ->
            Pages.GameOfLife.page

        _ ->
            staticPage (always Pages.Missing.missing)
