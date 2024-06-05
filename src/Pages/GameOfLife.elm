module Pages.GameOfLife exposing (..)

import Components exposing (blogHeading)
import Date exposing (fromPosix)
import Extra.GameOfLife.App
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Sitewide.Types exposing (SitewideModel, SitewideMsg)
import Time exposing (Month(..), millisToPosix, utc)


view : SitewideModel -> Html SitewideMsg
view model =
    article []
        [ blogHeading (text "Better living through sets") (fromPosix utc (millisToPosix 1717628661000))
        , p [] [ text "Lists are THE most overrated data type bar none. Who has ", em [] [ text "ever" ], text " needed an ordered sequence of values with duplication? Not me. Lists are such a ridiculous data structure that no one can even agree how they should be built. A collection of cons cells? A block of contiguous memory? Do we index into them with pointers? Do we iterate over them with folds? Are we really just using a queue or a stack? Lists are crazy." ]
        , p [] [ text "Nah. Sets are where it’s at." ]
        , p [] [ text "The mathemeticians have known about sets for a long time, but until recently (within the last 100 years!) programmers didn’t have access to them. Now we do but they remain woefully underutilized. But start looking around and you’ll see that sets are way better than lists for every conceivable application." ]
        , p [] [ text "To prove it to ya we are gon’ be implementing Conway’s Game of Life today. But we are going to be doing it with sets like civilized men and not lists like so many pagans. Because we use a real datatype we won’t have to worry about boundary conditions, we will have a compact core ruleset, cool diagrams will be easy to draw to explain what is going on, the implementation will naturally be sparse, and all will be right in the eyes of the Lord." ]
        , Extra.GameOfLife.App.view model.gameOfLifeBoard
        , h3 [] [ text "The Game Itself" ]
        , p [] [ text "The game of life is a simple cellular automaton. It is played out on an infinite grid of cells that are either  or  with rules for updating this grid. In order for a cell to be alive, it must either" ]
        , ol []
            [ li [] [ text "Have exactly three living neighbors" ]
            , li [] [ text "Have two or three living neighbors and have been alive in the previous timestep." ]
            ]
        , p [] [ text "By repeatedly applying the update rule to some initial grid you can observe all sorts of interesting behavior. People have developed initial patterns that explode in complexity, act like factories, fly across the grid, or even simulate entire computers. The game of life is in fact turing complete if that phrase is meaningful to you." ]
        , h3 [] [ text "The implementation" ]
        , p [] [ text "What is so remarkable about the game of life, the reason it has captured the imagination of so many computer scientists and mathematicians, is how this extremely simple ruleset gives rise to incredibly complex behavior. But even if it seems simple in theory, how can one express these rules simply in practice?" ]
        , p [] [ text "The heart of the trick is in how the grid is represented programmatically. It is tempting to use a two dimensional array to represent the grid, but this results in extra complexity at the boundary of the array. The true game of life is played on an infinite grid, so using a finite representation of the grid forces the implementation to either 1) resize the grid which involves complexity not found in the basic semantics of the game or 2) come up with boundary conditions, like cell death or a toroidal topology, that change the semantics of the game entirely." ]
        , p [] [ text "So instead of using a two dimensional array for the grid representation, we use a set containing the coordinates of all the living cells. With a point-set representation of the grid we have dealt with the problem of grid boundaries. But we have also translated the problem into a form which can almost entirely be calculated using elementary set operations. In principle we have also found a format that allows for huge efficiency gains by reducing the number of cells we have to check for updates, though to exploit this last point would require work that I deem beneath me." ]
        , p [] [ text "At a high level the algorithm for the point-set representation looks like this" ]
        , ol []
            [ li [] [ text "Identify which cells need to be checked for updates. Because the game of life rules only operate on cells which are alive or have living neighbors this amounts to finding all the cells which are alive or have living neighbors." ]
            , li [] [ text "For each cell identified in step 1, determine the next state of the cell. This requires counting up all living neighbors (which requires finding all living neighbors) and then applying the update rules based on this count." ]
            ]
        , p [] [ text "And that is all. So lets get down to raw code." ]
        , p [] [ text "(This implementation is in elm but the basic algorithm translates nicely to any language with proper support for sets. At the bottom I’ll have the full implementation of the update rule along with a link to the full source for the simulation above.)" ]
        , p [] [ text "First the data representation. The basic type here is the cell ", code [] [ text "type Cell = (Int,Int)" ], text ". Boards are then represented as ", code [] [ text "Set Cell" ], text ". To check if a particular cell is alive or dead with respect to a given environment is implemented with set membership: ", code [] [ text "cellIsAlive cell board = member cell board" ], text "." ]
        , p [] [ text "For both step 1 and 2 in the algorithm we need a way to compute the neighbors of a cell. Visually, this is what we are computing:" ]
        , img [ src "media/nearby.png", alt "nearby example" ] []
        , p [] [ text "In code there are several ways to do this. The easiest method would be to use the cartesian product of two sets which would look like" ]
        , pre [] [ code [] [ text "nearby : Cell -> Set Cell\nnearby (x,y) =\n    let adjacent1d n = fromList (range (n-1) (n+1))\n      in cartesianProduct (adjacent1d x) (adjacent1d y)" ] ]
        , p [] [ text "Which is very conceptually clean. Unfortunately elm sets don’t do cartesian products, and while we can implement them ourselves we can also just use the following modular arithmetic nonsense to achieve the same effect" ]
        , pre [] [ code [] [ text "nearby : Cell -> Set Cell\nnearby ( x, y ) =\n    map\n      (\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))\n      (fromList (range 0 8))" ] ]
        , p [] [ text "Using this neighbors funtction we can easily find all the cells we need to check. We find the neighbors for each living cell in the current grid and then we take the set union of all these nighborhoods. Visually we are doing this" ]
        , img [ src "media/cells-to-check.png", alt "cells to check example" ] []
        , p [] [ text "while in code we are doing this" ]
        , pre [] [ code [] [ text "cellsToCheck : Set Cell -> Set Cell\ncellsToCheck = foldl (nearby >> union) empty" ] ]
        , p [] [ text "This is doing a lot of functional programming stuff with folds and function composition and point free style which is all very impressive but in the end it just does what the diagram above is describing: go point by point, apply ", code [] [ text "nearby" ], text " to each point, take the n-way union of all the resulting neighborhoods." ]
        , p [] [ text "Once we’ve got a list of cells to update we need a way to check if they will be alive at the next timestep. We do this by first finding all of a cells living neighbors, counting them, and applying the update rule. To get the living neighbors of a cell is naught but a string of set operations" ]
        , pre [] [ code [] [ text "neighbors : Set Cell -> Cell -> Set Cell\nneighbors board cell = intersect board (diff (nearby cell) (singleton cell))" ] ]
        , p [] [ text "which visually corresponds to the following reduction" ]
        , img [ src "media/living-neighbors.png", alt "neighbors example" ] []
        , p [] [ text "In words this is . With this we can count up the number of neighbors and apply the update rule" ]
        , pre [] [ code [] [ text "cellWillBeAlive : Set Cell -> Cell -> Bool\ncellWillBeAlive board cell =\n    let numberNearby = size (neighbors board cell)\n    in numberNearby == 3 || (numberNearby == 2 && member cell board)" ] ]
        , p [] [ text "And for our final act we weave the update rule together with the cells that need checking" ]
        , pre [] [ code [] [ text "update : Set Cell -> Set Cell\nupdate board = filter (cellWillBeAlive board) (cellsToCheck board)" ] ]
        , p [] [ text "and we are done!" ]
        , p [] [ text "To use it is simplicity itself. Write down all the coordinates of living cells for the board you’d like to represent and then hit go" ]
        , pre [] [ code [] [ text "initialBoard : Set Cell\ninitialBoard = fromList [ (1,1), (1,2), (2,1) ]\n\nnextBoard : Set Cell\nnextBoard = update initialBoard" ] ]
        , p [] [ code [] [ text "nextBoard" ], text " will now be equal to ", code [] [ text "fromList [ (1,1), (1,2), (2,1), (2,2) ]" ], text "." ]
        , h3 [] [ text "Victory" ]
        , p [] [ text "So there we have it. The core rules for the game of life in less than thirty lines of code" ]
        , pre [] [ code [] [ text "module GameOfLife exposing (Cell, nextBoard)\n\nimport List exposing (range)\nimport Set exposing (..)\n\ntype alias Cell = (Int, Int)\n\nnearby : Cell -> Set Cell\nnearby ( x, y ) =\n    map\n      (\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))\n      (fromList (range 0 8))\n\nneighbors : Set Cell -> Cell -> Set Cell\nneighbors board cell = intersect board (diff (nearby cell) (singleton cell))\n\ncellWillBeAlive : Set Cell -> Cell -> Bool\ncellWillBeAlive board cell =\n    let numberNearby = size (neighbors board cell)\n    in numberNearby == 3 || (numberNearby == 2 && member cell board)\n\ncellsToCheck : Set Cell -> Set Cell\ncellsToCheck = foldl (nearby >> union) empty\n\nupdate : Set Cell -> Set Cell\nupdate board = filter (cellWillBeAlive board) (cellsToCheck board)" ] ]
        , p [] [ text "In order to make a cool interactive out of this we still need an event loop and some rendering code. This isn’t terribly hard to implement yourself but because I’m so generous I have a simple implementation ", a [ href "https://github.com/seanlucrussell/elm-life" ] [ text "hosted on Github" ], text "." ]
        , h3 [] [ text "In Conclusion" ]
        , p [] [ text "The most important thing we all learned today is that arrays drool and sets rule." ]
        , p [] [ text "But not just that. This is also a neat demonstration of how appropriate datastructure selection can greatly simplify and clarify the nature of a problem. By looking at living cells in the game of life as a set of grid coordinate we get a nice visual intuition for what the rules mean and how to implement them using predefined set operations. Choosing sets for the underlying datastructure also eliminated any boundary problems we might have had and provided us with a sparse, space efficient representation of the game for free." ]
        , p [] [ text "It is my opinion that sets are severely underutilized by programmers. A surprising number of situations, from storing command line options to understanding relational algebras (which in turn underly the design of SQL) or even for implementing the game of life, benefit from the judicious application of some simple set theory." ]
        , p [] [ text "So if nothing else I hope this at least served as an amusing example of the applications of sets to programming." ]
        , p [] [ text "And I hope this ", em [] [ text "sets" ], text " you up to think of sets next time you are programming." ]
        , p [] [ text "He. Hehehehe. Haaha. Ha." ]
        , p [] [ text "Go sets." ]
        ]
