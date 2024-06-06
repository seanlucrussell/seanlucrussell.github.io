module Extra.GameOfLife.App exposing (..)

import Css exposing (..)
import Extra.GameOfLife.ExampleBoards exposing (glider, gliderGun, methuselah, pulsar)
import Extra.GameOfLife.GameOfLife exposing (Board, nextBoard)
import Extra.GameOfLife.RenderBoard exposing (renderBoard)
import Html.Styled exposing (Html, button, div, text)
import Html.Styled.Attributes exposing (css, style)
import Html.Styled.Events exposing (onClick)
import Process
import Set exposing (map)
import Sitewide.Types exposing (SitewideModel, SitewideMsg(..))
import Task


sleep : Cmd SitewideMsg
sleep =
    Process.sleep 400 |> Task.perform (always GameOfLifeStep)


update : SitewideMsg -> SitewideModel -> ( SitewideModel, Cmd SitewideMsg )
update msg model =
    case msg of
        GameOfLifeStep ->
            ( { model | gameOfLifeBoard = nextBoard model.gameOfLifeBoard }, Cmd.none )

        LoadBoard board ->
            ( { model | gameOfLifeBoard = board }, Cmd.none )

        _ ->
            ( model, Cmd.none )


selectorButton : msg -> String -> Html msg
selectorButton msg description =
    button
        [ onClick msg
        ]
        [ text description ]


initialBoard : Board
initialBoard =
    offset 50 20 gliderGun


offset : Int -> Int -> Board -> Board
offset n m =
    map (\( x, y ) -> ( x + n, y + m ))


view : Board -> Html SitewideMsg
view b =
    div
        [ css [ width (pct 100), position relative ], style "aspect-ratio" "2/1" ]
        [ renderBoard b
        , div
            [ css
                [ position absolute
                , bottom (px 0)
                , width (pct 100)
                , displayFlex
                , justifyContent center
                , flexWrap wrap
                ]
            ]
            [ selectorButton (LoadBoard (offset 50 20 glider)) "Glider"
            , selectorButton (LoadBoard (offset 50 20 pulsar)) "Pulsar"
            , selectorButton (LoadBoard (offset 50 20 methuselah)) "Methuselah"
            , selectorButton (LoadBoard (offset 50 20 gliderGun)) "Glider Gun"
            ]
        ]
