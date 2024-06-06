module Extra.GameOfLife.RenderBoard exposing (..)

import Extra.GameOfLife.GameOfLife exposing (Board, Cell)
import Html.Styled exposing (Html)
import List exposing (filter, map)
import Set exposing (toList)
import String exposing (fromInt)
import Svg.Styled exposing (Svg, rect, svg)
import Svg.Styled.Attributes exposing (height, width, x, y)


renderBoard : Board -> Html msg
renderBoard board =
    svg
        [ width "100%", height "100%" ]
        (map renderCell (filter inBounds (toList board)))


inBounds : Cell -> Bool
inBounds ( x, y ) =
    0 <= x && x < 100 && 0 <= y && y < 50


renderCell : Cell -> Svg msg
renderCell ( xPos, yPos ) =
    rect
        [ x (fromInt xPos ++ ".5%")
        , y (fromInt (2 * yPos + 1) ++ "%")
        , height "0.15em"
        , width "0.15em"
        ]
        []
