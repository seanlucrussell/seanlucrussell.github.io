---
moduleName: "GameOfLife"
dynamic: True
primaryUrl: "/LIFE"
date: 2022-11-16
update: Extra.GameOfLife.App.update
imports:
  - Extra.GameOfLife.App
  - Extra.GameOfLife.Diagrams
---

# Better Living Through Sets

Lists are THE most overrated data type bar none. Who has *ever* needed an ordered sequence of values with duplication? Not me. Lists are such a ridiculous data structure that no one can even agree how they should be built. A collection of cons cells? A block of contiguous memory? Do we index into them with pointers? Do we iterate over them with folds? Are we really just using a queue or a stack? Lists are crazy.

Nah. Sets are where it's at.

The mathemeticians have known about sets for a long time, but until recently (within the last 100 years!) programmers didn't have access to them. Now we do but they remain woefully underutilized. But start looking around and you'll see that sets are way better than lists for every conceivable application.

To prove it to ya we are gon' be implementing Conway's Game of Life today. But we are going to be doing it with sets like civilized men and not lists like so many pagans. Because we use a real datatype we won't have to worry about boundary conditions, we will have a compact core ruleset, cool diagrams will be easy to draw to explain what is going on, the implementation will naturally be sparse, and all will be right in the eyes of the Lord.

```sitecode
Extra.GameOfLife.App.view model.gameOfLifeBoard
```

### The Game Itself

The game of life is a simple cellular automaton. It is played out on an infinite grid of cells that are either "alive" or "dead" with rules for updating this grid. In order for a cell to be alive, it must either

1. Have exactly three living neighbors
2. Have two or three living neighbors and have been alive in the previous timestep.

By repeatedly applying the update rule to some initial grid you can observe all sorts of interesting behavior. People have developed initial patterns that explode in complexity, act like factories, fly across the grid, or even simulate entire computers. The game of life is in fact turing complete if that phrase is meaningful to you.

### The implementation

What is so remarkable about the game of life, the reason it has captured the imagination of so many computer scientists and mathematicians, is how this extremely simple ruleset gives rise to incredibly complex behavior. But even if it seems simple in theory, how can one express these rules simply in practice?

The heart of the trick is in how the grid is represented programmatically. It is tempting to use a two dimensional array to represent the grid, but this results in extra complexity at the boundary of the array. The true game of life is played on an infinite grid, so using a finite representation of the grid forces the implementation to either 1) resize the grid which involves complexity not found in the basic semantics of the game or 2) come up with boundary conditions, like cell death or a toroidal topology, that change the semantics of the game entirely.

So instead of using a two dimensional array for the grid representation, we use a set containing the coordinates of all the living cells. With a point-set representation of the grid we have dealt with the problem of grid boundaries. But we have also translated the problem into a form which can almost entirely be calculated using elementary set operations. In principle we have also found a format that allows for huge efficiency gains by reducing the number of cells we have to check for updates, though to exploit this last point would require work that I deem beneath me.

At a high level the algorithm for the point-set representation looks like this

1. Identify which cells need to be checked for updates. Because the game of life rules only operate on cells which are alive or have living neighbors this amounts to finding all the cells which are alive or have living neighbors.
2. For each cell identified in step 1, determine the next state of the cell. This requires counting up all living neighbors (which requires finding all living neighbors) and then applying the update rules based on this count.

And that is all. So lets get down to raw code.

(This implementation is in elm but the basic algorithm translates nicely to any language with proper support for sets. At the bottom I'll have the full implementation of the update rule along with a link to the full source for the simulation above.)

First the data representation. The basic type here is the cell `type Cell = (Int,Int)`. Boards are then represented as `Set Cell`. To check if a particular cell is alive or dead with respect to a given environment is implemented with set membership: `cellIsAlive cell board = member cell board`.

For both step 1 and 2 in the algorithm we need a way to compute the neighbors of a cell. Visually, this is what we are computing:

```sitecode
Extra.GameOfLife.Diagrams.nearDiagram
```

In code there are several ways to do this. The easiest method would be to use the cartesian product of two sets which would look like

```elm
near : Cell -> Set Cell
near (x,y) =
    let adjacent1d n = fromList (range (n-1) (n+1))
      in cartesianProduct (adjacent1d x) (adjacent1d y)
```

Which is very conceptually clean. Unfortunately elm sets don't do cartesian products, and while we can implement them ourselves we can also just use the following modular arithmetic nonsense to achieve the same effect

```elm
near : Cell -> Set Cell
near ( x, y ) =
    map
      (\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))
      (fromList (range 0 8))
```

Using this neighbors funtction we can easily find all the cells we need to check. We find the neighbors for each living cell in the current grid and then we take the set union of all these nighborhoods. Visually we are doing this


```sitecode
Extra.GameOfLife.Diagrams.cellsToCheckDiagram
```

while in code we are doing this

```elm
cellsToCheck : Set Cell -> Set Cell
cellsToCheck = foldl (near >> union) empty
```

This is doing a lot of functional programming stuff with folds and function composition and point free style which is all very impressive but in the end it just does what the diagram above is describing: go point by point, apply `near` to each point, take the n-way union of all the resulting neighborhoods.

Once we've got a list of cells to update we need a way to check if they will be alive at the next timestep. We do this by first finding all of a cells living neighbors, counting them, and applying the update rule. To get the living neighbors of a cell is naught but a string of set operations

```elm
neighbors : Set Cell -> Cell -> Set Cell
neighbors board cell =
    intersect board (diff (near cell) (singleton cell))
```

which visually corresponds to the following reduction

```sitecode
Extra.GameOfLife.Diagrams.livingNeighborsDiagram
```

In words this is "the set of all cells that are both in the board and in the neighborhood but are not the cell itself". With this we can count up the number of neighbors and apply the update rule

```elm
cellWillBeAlive : Set Cell -> Cell -> Bool
cellWillBeAlive board cell =
    let numberNearby = size (neighbors board cell)
    in numberNearby == 3 || (numberNearby == 2 && member cell board)
```

And for our final act we weave the update rule together with the cells that need checking

```elm
update : Set Cell -> Set Cell
update board = filter (cellWillBeAlive board) (cellsToCheck board)
```

and we are done!

To use it is simplicity itself. Write down all the coordinates of living cells for the board you'd like to represent and then hit go

```elm
initialBoard : Set Cell
initialBoard = fromList [ (1,1), (1,2), (2,1) ]

nextBoard : Set Cell
nextBoard = update initialBoard
```

`nextBoard` will now be equal to `fromList [ (1,1), (1,2), (2,1), (2,2) ]`.

### Victory

So there we have it. The core rules for the game of life in less than thirty lines of code

```elm
module GameOfLife exposing (Cell, nextBoard)

import List exposing (range)
import Set exposing (..)

type alias Cell = (Int, Int)

near : Cell -> Set Cell
near ( x, y ) =
    map
      (\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))
      (fromList (range 0 8))

neighbors : Set Cell -> Cell -> Set Cell
neighbors board cell =
    intersect board (diff (near cell) (singleton cell))

cellWillBeAlive : Set Cell -> Cell -> Bool
cellWillBeAlive board cell =
    let numberNearby = size (neighbors board cell)
    in numberNearby == 3 || (numberNearby == 2 && member cell board)

cellsToCheck : Set Cell -> Set Cell
cellsToCheck = foldl (near >> union) empty

update : Set Cell -> Set Cell
update board = filter (cellWillBeAlive board) (cellsToCheck board)
```

In order to make a cool interactive out of this we still need an event loop and some rendering code. This isn't terribly hard to implement yourself but because I'm so generous I have a simple implementation [hosted on Github](https://github.com/seanlucrussell/elm-life).

### In Conclusion

The most important thing we all learned today is that arrays drool and sets rule.

But not just that. This is also a neat demonstration of how appropriate datastructure selection can greatly simplify and clarify the nature of a problem. By looking at living cells in the game of life as a set of grid coordinate we get a nice visual intuition for what the rules mean and how to implement them using predefined set operations. Choosing sets for the underlying datastructure also eliminated any boundary problems we might have had and provided us with a sparse, space efficient representation of the game for free.

It is my opinion that sets are severely underutilized by programmers. A surprising number of situations, from storing command line options to understanding relational algebras (which in turn underly the design of SQL) or even for implementing the game of life, benefit from the judicious application of some simple set theory.

So if nothing else I hope this at least served as an amusing example of the applications of sets to programming.

And I hope this *sets* you up to think of sets next time you are programming.

He. Hehehehe. Haaha. Ha.

Go sets.