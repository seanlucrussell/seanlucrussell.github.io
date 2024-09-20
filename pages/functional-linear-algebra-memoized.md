---
moduleName: FunctionalLinearAlgebraMemoized
primaryUrl: "/FNLINALGMEMO"
static: True
math: True
date: 2024-09-20
---

# Functional Linear Algebra, Memoized

This is a second appendix to [Functional Linear Algebra](/FNLINALG). It's a continuation of the first appendix, really, [Functional Linear Algebra, With Types](/FNLINALGTYPED). There we extended the original Python implementation in Haskell so all our matrix and vector operations are very nicely typed. But in the process we lost a lot of performance. This brief note discusses memoizing the Haskell impelmentation.

The idea is pretty simple, actually. The reason performance suffered has to do with our representation of vectors as functions. When we describe a vector in terms of a big chain of operations that involve contractions, we unfortunately do not typically share those contraction results across indices. If we have a 3d vector defined as a product $M\vec v$, then to find $\vec v_i$ and $\vec v_j$ we are running a the same contraction over indices two different times. This is obviously redundant. This results in our power iteration running in $O(d^n)$ time, where $d$ is the dimensionality of the matrix and $n$ is the iteration count.

The dumbest way to fix this I know of is to embed a vector or matrix into an array. This effectively forces the computations to be shared. Here is a quick way to do this using some imports from `Data.Array` (full code at the end of this post):

```haskell
memoizeVector :: forall a. KnownNat a => Vector a -> Vector a
memoizeVector v =
  let
    bounds =
        ( fromIntegral (minBound :: Finite a)
        , fromIntegral (maxBound :: Finite a))
    arr = listArray bounds (map v finites)
  in \i -> arr ! fromIntegral (getFinite i)
```

With this we only change one thing in our existing code. We memoize part of our loop

```haskell
powerIteration b0 m =
    ...
    loop i b' = loop (i-1) (normalize (memoizeVector (mvmul m b')))
    ...
```

We inject this one call to `memoizeVector`. Now we can increase the number of loop iterations by a whole bunch

```haskell
powerIteration b0 m =
    ...
    b = loop 1000 b0
    ...
```

(the iterations were maxing out around 7 before) and the code runs almost instantly. We are now pretty firmly in $O(d \times n)$ territory for the runtime of this algorithm.

Before we end some brief discussion.

Full disclosure, I don't totally love this solution. For a few different reasons. It doesn't feel very principled. I don't have a good theory for exactly when it will be necessary to insert these memoization calls, or precisely where to insert them. To figure this instance out I poked at the code for a while and got it to do the right thing but trial-and-error seems like the wrong way to go about optimizing this. It feels like there should be some sort of theory or equational law or standard rewrite or something that makes this fast.

I also don't love throwing away totality within the body of the `memoizeVector` definition. I *know* that the array index lookup will never throw an error, but non-total functions, even those that are well reasoned, give me the ick. Is this a stupid criticism? Probably. But I can't help but feel that the presence of partiality signals that something fundamental is wrong and that a better approach exists.

Nevertheless, memoizing works. And it works really well. The original version of this example took a little over 10 seconds to run 7 power iteration loops and was growing exponentially. The memoized version can run 1,000,000 iterations in under 5 seconds and grows linearly from there. Beautiful or not, memoizing is certainly effective.

So there you have it. A fast, type safe, very simple functional implementation of linear algebra in Haskell that represents matrices and vectors as functions. I leave it to you to find whatever meaning you want in this exercise. Perhaps this is just a cool trick. Perhaps it's a fun excuse to try out some easy, type-level programming. Perhaps this is a deep insight into the fundamental nature of linear algebra. Perhaps it's a meditation on the benefits and challenges of encoding data with functions. Or perhaps it means something else to you.

Whatever the case, I am much obliged that you've read through to the end with me. I leave the full source of this memoized implementation in your care. Use it wisely.

```haskell
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeApplications #-}

module Main where

import Data.Array
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
  pure (\i -> l !! fromIntegral i)

mfromlist :: forall n m. (KnownNat n, KnownNat m) => [[Float]] -> Maybe (Matrix n m)
mfromlist l = do
  guard (length l == length (finites @n))
  ls <- sequence (fmap vfromlist l)
  pure (\i -> ls !! fromIntegral i)

memoizeVector :: forall a. KnownNat a => Vector a -> Vector a
memoizeVector v =
  let
    bounds = (fromIntegral (minBound :: Finite a), fromIntegral (maxBound :: Finite a))
    arr = listArray bounds (map v finites)
  in \i -> arr ! fromIntegral (getFinite i)

powerIteration :: forall a. KnownNat a => Vector a -> Matrix a a -> (Float, Vector a)
powerIteration b0 m =
  let
    loop :: Int -> Vector a -> Vector a
    loop 0 b' = b'
    loop i b' = loop (i-1) (normalize (memoizeVector (mvmul m b')))
    b :: Vector a
    b = loop 1000 b0
    eigenvalue :: Float
    eigenvalue = dot b (mvmul m b)
  in (eigenvalue, b)

deflate :: forall a. KnownNat a => Matrix a a -> Float -> Vector a -> Matrix a a
deflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))

a :: Matrix 3 3
Just a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]

b0 :: Vector 3
Just b0 = vfromlist([1,2,3])

pow = powerIteration

e1 :: (Float, Vector 3)
e1 = pow b0 a
a_deflated :: Matrix 3 3
a_deflated = deflate a (fst e1) (snd e1)
e2 :: (Float, Vector 3)
e2 = pow b0 a_deflated

display :: (Float, Vector 3) -> String
display (eval, evec) = "λ: " ++ show eval ++ " " ++ intercalate " " (map (\i -> show (getFinite i) ++ ": " ++ show (evec i)) finites)

main :: IO ()
main = do putStrLn (display e1)
          putStrLn (display e2)
```