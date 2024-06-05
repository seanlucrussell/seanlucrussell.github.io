module Extra.GameOfLife.GameOfLife exposing (..)

import List exposing (range)
import Set exposing (..)


type alias Cell =
    ( Int, Int )


type alias Board =
    Set Cell


nearby : Cell -> Board
nearby ( x, y ) =
    map (\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 )) (fromList (range 0 8))


neighbors : Set Cell -> Cell -> Set Cell
neighbors board cell =
    intersect board (diff (nearby cell) (singleton cell))


cellWillBeAlive : Board -> Cell -> Bool
cellWillBeAlive board cell =
    let
        numberOfNeighbors =
            size (neighbors board cell)
    in
    numberOfNeighbors == 3 || (numberOfNeighbors == 2 && member cell board)


cellsToCheck : Board -> Board
cellsToCheck =
    foldl (nearby >> union) empty


nextBoard : Board -> Board
nextBoard board =
    cullBoard (filter (cellWillBeAlive board) (cellsToCheck board))



-- remove any cells that are way too far away to be relevant


cullBoard : Board -> Board
cullBoard =
    filter (\( x, y ) -> abs x < 300 && abs y < 300)
