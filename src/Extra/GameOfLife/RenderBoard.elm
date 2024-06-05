module Extra.GameOfLife.RenderBoard exposing (..)

import Extra.GameOfLife.GameOfLife exposing (Board, Cell)
import Html.Styled exposing (Html)
import List exposing (filter, map)
import Set exposing (toList)
import String exposing (fromFloat, fromInt)
import Svg.Styled exposing (Svg, circle, svg)
import Svg.Styled.Attributes exposing (cx, cy, fill, fillOpacity, height, r, width)


renderBoard : Board -> Html msg
renderBoard board =
    svg
        [ width "100%"
        , height "100%"
        ]
        (map renderCell (filter inBounds (toList board)))


inBounds : Cell -> Bool
inBounds ( x, y ) =
    0 <= x && x < 100 && 0 <= y && y < 50


renderCell : Cell -> Svg msg
renderCell cell =
    let
        ( x, y ) =
            cell

        opacity =
            1 / (1.001 ^ ((toFloat x - 49) ^ 2 + (toFloat y - 24) ^ 2))
    in
    circle
        [ cx (fromInt x ++ ".5%")
        , cy (fromInt (2 * y + 1) ++ "%")
        , r "0.5%"
        , fill "red"
        , fillOpacity (fromFloat opacity)
        ]
        []
