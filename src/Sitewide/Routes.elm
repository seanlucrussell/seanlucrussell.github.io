module Sitewide.Routes exposing (..)

import Html.Styled exposing (Html)
import Pages.DiyPatternMatching
import Pages.FunctionalLinearAlgebra
import Pages.FunctionalLinearAlgebraMemoized
import Pages.FunctionalLinearAlgebraWithTypes
import Pages.GameOfLife
import Pages.Missing
import Pages.Navigation
import Pages.RecursionSchemes
import Pages.Test
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

        "/FNLINALG" ->
            Pages.FunctionalLinearAlgebra.page

        "/FNLINALGTYPED" ->
            Pages.FunctionalLinearAlgebraWithTypes.page

        "/FNLINALGMEMO" ->
            Pages.FunctionalLinearAlgebraMemoized.page

        "/DIYPTRNMATCH" ->
            Pages.DiyPatternMatching.page

        "/TEST" ->
            Pages.Test.page

        _ ->
            staticPage (always Pages.Missing.missing)
