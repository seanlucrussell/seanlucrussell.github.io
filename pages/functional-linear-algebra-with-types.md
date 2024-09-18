---
moduleName: FunctionalLinearAlgebraWithTypes
primaryUrl: "/FNLINALGTYPED"
static: True
date: 2024-09-17
---

# Functional Linear Algebra, with Types

This is an appendix to [Functional Linear Algebra](/FNLINALG) that fills in one of the biggest gaps from that essay. If you haven't read it, the premise is that I didn't want to install numpy. Instead we talked over how we can represent vectors and matrices using functions from some set of labels (e.g. X, Y, Z or 0, 1, 2) to scalars. And with this representation we can write all sorts of operations pretty simply as higher order functions. If you want more details go read that article, I think it's a pretty cool idea if I do say so myself.

I alluded to a better system for representing dimensions in that essay. Some handwaving suggestions that "with the magic of types we can nicely deal with contractions over dimensions" and stuff like that. This appendix closes that loop by showing how to do this quite elegantly in Haskell. Porting this demonstration to other languages is clearly trivial and left as an exercise to the reader (I'm so sorry but I'm too dumb to figure it out myself).

The only new piece of technology we will use is the `Data.Finite` module. `Data.Finite` uses some fancy Haskell stuff with type level natural numbers to provide an easy way to build finite sets of a given cardinality. For example the type `Finite 3` will contain the values `finite 0`, `finite 1`, and `finite 2`, and nothing else.

Crucially the module provides us a nice utility, `finites`, that gives us an iterator over all elements of a particular finite set with a particular cardinality. If we were to evaluate `finites :: [Finite 4]` we would be yielded the result `[finite 0, finite 1, finite 2, finite 3]`. This means that our types carry precisely the information needed to define iterators for the `contract` function we were using last time.

If that doesn't make sense, don't worry about it. Have some code instead.

```haskell
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeApplications #-}

module Main where

import GHC.TypeLits
import Data.Finite
import Data.Maybe
import Data.List
import Control.Monad

type Vector a = Finite a -> Float
type Matrix a b = Finite a -> Finite b -> Float

contract :: forall a. KnownNat a => Vector a -> Float
contract f = sum (map f finites)

mmadd :: Matrix a b -> Matrix a b -> Matrix a b
mmadd m n i j = m i j + n i j

mmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c)
  => Matrix a b -> Matrix b c -> Matrix a c
mmmul m n i j = contract (\k -> m i k * n k j)

mvmul :: forall a b. (KnownNat a, KnownNat b)
  => Matrix a b -> Vector b -> Vector a
mvmul m v i = contract (\k -> m i k * v k)

smmul :: Float -> Matrix a b -> Matrix a b
smmul s m i j = s * m i j

svmul :: Float -> Vector a -> Vector a
svmul s v i = s * v i

dot :: forall a. KnownNat a => Vector a -> Vector a -> Float
dot v w = contract (\k -> v k * w k)

magnitude :: forall a. KnownNat a => Vector a -> Float
magnitude v = (contract (\k -> (v k)**2))**0.5

normalize :: forall a. KnownNat a => Vector a -> Vector a
normalize v = svmul (1 / (magnitude v)) v

outer :: Vector a -> Vector b -> Matrix a b
outer v w i j = v i * w j

vfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)
vfromlist l = do
  guard (length l == length (finites @n))
  pure (\i -> (l !! fromIntegral (getFinite i)))

mfromlist :: forall n m. (KnownNat n, KnownNat m)
  => [[Float]] -> Maybe (Matrix n m)
mfromlist l = do
  guard (length l == length (finites @n))
  ls <- sequence (fmap vfromlist l)
  pure (\i -> (ls !! fromIntegral (getFinite i)))
```

This is what our linear algebra library looks like when translated into Haskell. If you were to cross reference it with the python implementation from the other post, you'd notice only a few key differences.

1. Type annotations. The whole point is that we are trying to make this new scheme well typed, no? Most of the new lines here are type annotations. These annotations are mostly intuitive, though the `forall a.KnownNat a` stuff may be a bit perplexing. Just know that this universal quantification is how we pass around the type information that lets us write `contract` all nice like.
2. More complex conversions from lists to matrices and vectors. The python list conversion functions did no bounds checking, so we added some extra stuff to make the matrix conversions type safe.
3. The type aliases `Vector` and `Matrix`. They are just aliases for functions!
4. Perhaps the real star of the show, our new definitions for `contract`. Notice how it no longer depends on some hard coded `dims` array floating around in the ether, but it also doesn't require any new arguments? That's the magic of our chosen library and the `finites` function. `finites` lets us access the type level data we need to iterate over all the values of a given axis.

Everything else in the library is a very straightforward translation from Python to Haskell.

From here we rush through the remainder of the example from the original essay. Here we define our power iteration and deflation functions

```haskell
powerIteration :: forall a. KnownNat a
  => Vector a -> Matrix a a -> (Float, Vector a)
powerIteration b0 m =
  let
    loop :: Int -> Vector a -> Vector a
    loop 0 b' = b'
    loop i b' = (normalize (mvmul m (loop (i-1) b')))
    b :: Vector a
    b = loop 5 b0
    eigenvalue :: Float
    eigenvalue = dot b (mvmul m b)
  in (eigenvalue, b)

deflate :: forall a. KnownNat a
  => Matrix a a -> Float -> Vector a -> Matrix a a
deflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))
```

You can read from the type signatures that we can only define these methods over a square matrix, since our functions operate on `Matrix a a`. And here is an example calculation using `powerIteration` and `deflate`

```haskell
a :: Matrix 3 3
Just a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]

b0 :: Vector 3
Just b0 = vfromlist([1,2,3])

e1 :: (Float, Vector 3)
e1 = powerIteration b0 a
a_deflated :: Matrix 3 3
a_deflated = deflate a (fst e1) (snd e1)
e2 :: (Float, Vector 3)
e2 = powerIteration b0 a_deflated

display :: (Float, Vector 3) -> String
display (eval, evec) =
  "λ: "
  ++ show eval
  ++ " "
  ++ intercalate " "
       (map
         (\i -> show (getFinite i) ++ ": " ++ show (evec i))
         finites)

main :: IO ()
main = do putStrLn (display e1)
          putStrLn (display e2)
```

Notice that we have lovely type level natural numbers on the type of `a`. You won't get confused when you see `a :: Matrix 3 3`. It's scientifically impossible. When we put everything together and run it we get the results that we hope for

```
λ: 5.7912016 0: 0.7802645 1: 0.28464365 2: 0.55692476
λ: 2.9946988 0: -4.2912193e-2 1: 0.90928996 2: -0.41394478
```

Isn't this lovely? I think it is lovely. Our linear algebra system is perfectly well typed *and* we still have the incredible flexibiliy offered by defining matrices and vectors in terms of functions. Need an identity matrix? Here's a perfectly typed identity matrix.

```haskell
identity :: Matrix a a
identity i j = if i == j then 1 else 0
```

Too easy.

Before wrapping up, here is the full source code you can use to experiment with yourself.

```haskell
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeApplications #-}

module Main where

import GHC.TypeLits
import Data.Finite
import Data.Maybe
import Data.List
import Control.Monad

type Vector a = Finite a -> Float
type Matrix a b = Finite a -> Finite b -> Float

contract :: forall a. KnownNat a => Vector a -> Float
contract f = sum (map f finites)

mmadd :: Matrix a b -> Matrix a b -> Matrix a b
mmadd m n i j = m i j + n i j

mmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c) => Matrix a b -> Matrix b c -> Matrix a c
mmmul m n i j = contract (\k -> m i k * n k j)

mvmul :: forall a b. (KnownNat a, KnownNat b) => Matrix a b -> Vector b -> Vector a
mvmul m v i = contract (\k -> m i k * v k)

smmul :: Float -> Matrix a b -> Matrix a b
smmul s m i j = s * m i j

svmul :: Float -> Vector a -> Vector a
svmul s v i = s * v i

dot :: forall a. KnownNat a => Vector a -> Vector a -> Float
dot v w = contract (\k -> v k * w k)

magnitude :: forall a. KnownNat a => Vector a -> Float
magnitude v = (contract (\k -> (v k)**2))**0.5

normalize :: forall a. KnownNat a => Vector a -> Vector a
normalize v = svmul (1 / (magnitude v)) v

outer :: Vector a -> Vector b -> Matrix a b
outer v w i j = v i * w j

vfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)
vfromlist l = do
  guard (length l == length (finites @n))
  pure (\i -> (l !! fromIntegral (getFinite i)))

mfromlist :: forall n m. (KnownNat n, KnownNat m) => [[Float]] -> Maybe (Matrix n m)
mfromlist l = do
  guard (length l == length (finites @n))
  ls <- sequence (fmap vfromlist l)
  pure (\i -> (ls !! fromIntegral (getFinite i)))

powerIteration :: forall a. KnownNat a => Vector a -> Matrix a a -> (Float, Vector a)
powerIteration b0 m =
  let
    loop :: Int -> Vector a -> Vector a
    loop 0 b' = b'
    loop i b' = (normalize (mvmul m (loop (i-1) b')))
    b :: Vector a
    b = loop 2 b0
    eigenvalue :: Float
    eigenvalue = dot b (mvmul m b)
  in (eigenvalue, b)

deflate :: forall a. KnownNat a => Matrix a a -> Float -> Vector a -> Matrix a a
deflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))

a :: Matrix 3 3
Just a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]

b0 :: Vector 3
Just b0 = vfromlist([1,2,3])

e1 :: (Float, Vector 3)
e1 = powerIteration b0 a
a_deflated :: Matrix 3 3
a_deflated = deflate a (fst e1) (snd e1)
e2 :: (Float, Vector 3)
e2 = powerIteration b0 a_deflated

display :: (Float, Vector 3) -> String
display (eval, evec) = "λ: " ++ show eval ++ " " ++ intercalate " " (map (\i -> show (getFinite i) ++ ": " ++ show (evec i)) finites)

identity :: Matrix a a
identity i j = if i == j then 1 else 0

main :: IO ()
main = do putStrLn (display e1)
          putStrLn (display e2)
```

If you try running this code you will notice there is one very minor drawback to this implementation. Memoizing is unfortunately not as braindead simple in Haskell as it is in python, so i haven't implemented it. I don't even really have a good idea how to implement it yet in a way that sparks joy. Obviously this code *could* be memoized, but I'm not sure how to do it without sacrificing the semantic clarity we've gained from turning everything into functions. And if we lose the simplicity then we've lost a lot of the draw of this approach.

So there is still work to do.

Nevertheless! We have from the original essay a fairly performant memoized implementation of functional linear algebra. And we have in this appendix a very nicely typed implementation of functional linear algebra. The technique works.

And we still haven't installed numpy.

Good job team.