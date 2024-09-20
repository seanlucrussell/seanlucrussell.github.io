module Pages.FunctionalLinearAlgebraWithTypes exposing (..)

import Components exposing (blogHeading)
import Date exposing (fromPosix)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Sitewide.Types exposing (Article, Page)
import Time exposing (Month(..), millisToPosix, utc)


page : Page
page =
    { view =
        \_ ->
            Html.Styled.article []
                [ blogHeading (text "Functional Linear Algebra, with Types") article.publicationDate
                , p [] [ text "This is an appendix to ", a [ href "/FNLINALG" ] [ text "Functional Linear Algebra" ], text " that fills in one of the biggest gaps from that essay. If you haven’t read it, the premise is that I didn’t want to install numpy. Instead we talked over how we can represent vectors and matrices using functions from some set of labels (e.g. X, Y, Z or 0, 1, 2) to scalars. And with this representation we can write all sorts of operations pretty simply as higher order functions. If you want more details go read that article, I think it’s a pretty cool idea if I do say so myself." ]
                , p [] [ text "I alluded to a better system for representing dimensions in that essay. Some handwaving suggestions that \"", text "with the magic of types we can nicely deal with contractions over dimensions", text "\" and stuff like that. This appendix closes that loop by showing how to do this quite elegantly in Haskell. Porting this demonstration to other languages is clearly trivial and left as an exercise to the reader (I’m so sorry but I’m too dumb to figure it out myself)." ]
                , p [] [ text "The only new piece of technology we will use is the ", code [] [ text "Data.Finite" ], text " module. ", code [] [ text "Data.Finite" ], text " uses some fancy Haskell stuff with type level natural numbers to provide an easy way to build finite sets of a given cardinality. For example the type ", code [] [ text "Finite 3" ], text " will contain the values ", code [] [ text "finite 0" ], text ", ", code [] [ text "finite 1" ], text ", and ", code [] [ text "finite 2" ], text ", and nothing else." ]
                , p [] [ text "Crucially the module provides us a nice utility, ", code [] [ text "finites" ], text ", that gives us an iterator over all elements of a particular finite set with a particular cardinality. If we were to evaluate ", code [] [ text "finites :: [Finite 4]" ], text " we would be yielded the result ", code [] [ text "[finite 0, finite 1, finite 2, finite 3]" ], text ". This means that our types carry precisely the information needed to define iterators for the ", code [] [ text "contract" ], text " function we were using last time." ]
                , p [] [ text "If that doesn’t make sense, don’t worry about it. Have some code instead." ]
                , pre [] [ code [] [ text "{-# LANGUAGE ScopedTypeVariables #-}\n{-# LANGUAGE DataKinds #-}\n{-# LANGUAGE TypeApplications #-}\n\nmodule Main where\n\nimport GHC.TypeLits\nimport Data.Finite\nimport Data.Maybe\nimport Data.List\nimport Control.Monad\n\ntype Vector a = Finite a -> Float\ntype Matrix a b = Finite a -> Finite b -> Float\n\ncontract :: forall a. KnownNat a => Vector a -> Float\ncontract f = sum (map f finites)\n\nmmadd :: Matrix a b -> Matrix a b -> Matrix a b\nmmadd m n i j = m i j + n i j\n\nmmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c)\n  => Matrix a b -> Matrix b c -> Matrix a c\nmmmul m n i j = contract (\\k -> m i k * n k j)\n\nmvmul :: forall a b. (KnownNat a, KnownNat b)\n  => Matrix a b -> Vector b -> Vector a\nmvmul m v i = contract (\\k -> m i k * v k)\n\nsmmul :: Float -> Matrix a b -> Matrix a b\nsmmul s m i j = s * m i j\n\nsvmul :: Float -> Vector a -> Vector a\nsvmul s v i = s * v i\n\ndot :: forall a. KnownNat a => Vector a -> Vector a -> Float\ndot v w = contract (\\k -> v k * w k)\n\nmagnitude :: forall a. KnownNat a => Vector a -> Float\nmagnitude v = (contract (\\k -> (v k)**2))**0.5\n\nnormalize :: forall a. KnownNat a => Vector a -> Vector a\nnormalize v = svmul (1 / (magnitude v)) v\n\nouter :: Vector a -> Vector b -> Matrix a b\nouter v w i j = v i * w j\n\nvfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)\nvfromlist l = do\n  guard (length l == length (finites @n))\n  pure (\\i -> l !! getFinite i)\n\nmfromlist :: forall n m. (KnownNat n, KnownNat m)\n  => [[Float]] -> Maybe (Matrix n m)\nmfromlist l = do\n  guard (length l == length (finites @n))\n  ls <- sequence (fmap vfromlist l)\n  pure (\\i -> ls !! getFinite i)" ] ]
                , p [] [ text "This is what our linear algebra library looks like when translated into Haskell. If you were to cross reference it with the python implementation from the other post, you’d notice only a few key differences." ]
                , ol []
                    [ li [] [ text "Type annotations. The whole point is that we are trying to make this new scheme well typed, no? Most of the new lines here are type annotations. These annotations are mostly intuitive, though the ", code [] [ text "forall a.KnownNat a" ], text " stuff may be a bit perplexing. Just know that this universal quantification is how we pass around the type information that lets us write ", code [] [ text "contract" ], text " all nice like." ]
                    , li [] [ text "More complex conversions from lists to matrices and vectors. The python list conversion functions did no bounds checking, so we added some extra stuff to make the matrix conversions type safe." ]
                    , li [] [ text "The type aliases ", code [] [ text "Vector" ], text " and ", code [] [ text "Matrix" ], text ". They are just aliases for functions!" ]
                    , li [] [ text "Perhaps the real star of the show, our new definitions for ", code [] [ text "contract" ], text ". Notice how it no longer depends on some hard coded ", code [] [ text "dims" ], text " array floating around in the ether, but it also doesn’t require any new arguments? That’s the magic of our chosen library and the ", code [] [ text "finites" ], text " function. ", code [] [ text "finites" ], text " lets us access the type level data we need to iterate over all the values of a given axis." ]
                    ]
                , p [] [ text "Everything else in the library is a very straightforward translation from Python to Haskell." ]
                , p [] [ text "From here we rush through the remainder of the example from the original essay. Here we define our power iteration and deflation functions" ]
                , pre [] [ code [] [ text "powerIteration :: forall a. KnownNat a\n  => Vector a -> Matrix a a -> (Float, Vector a)\npowerIteration b0 m =\n  let\n    loop :: Int -> Vector a -> Vector a\n    loop 0 b' = b'\n    loop i b' = loop (i-1) (normalize (mvmul m b'))\n    b :: Vector a\n    b = loop 5 b0\n    eigenvalue :: Float\n    eigenvalue = dot b (mvmul m b)\n  in (eigenvalue, b)\n\ndeflate :: forall a. KnownNat a\n  => Matrix a a -> Float -> Vector a -> Matrix a a\ndeflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))" ] ]
                , p [] [ text "You can read from the type signatures that we can only define these methods over a square matrix, since our functions operate on ", code [] [ text "Matrix a a" ], text ". And here is an example calculation using ", code [] [ text "powerIteration" ], text " and ", code [] [ text "deflate" ] ]
                , pre [] [ code [] [ text "a :: Matrix 3 3\nJust a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]\n\nb0 :: Vector 3\nJust b0 = vfromlist([1,2,3])\n\ne1 :: (Float, Vector 3)\ne1 = powerIteration b0 a\na_deflated :: Matrix 3 3\na_deflated = deflate a (fst e1) (snd e1)\ne2 :: (Float, Vector 3)\ne2 = powerIteration b0 a_deflated\n\ndisplay :: (Float, Vector 3) -> String\ndisplay (eval, evec) =\n  \"λ: \"\n  ++ show eval\n  ++ \" \"\n  ++ intercalate \" \"\n       (map\n         (\\i -> show (getFinite i) ++ \": \" ++ show (evec i))\n         finites)\n\nmain :: IO ()\nmain = do putStrLn (display e1)\n          putStrLn (display e2)" ] ]
                , p [] [ text "Notice that we have lovely type level natural numbers on the type of ", code [] [ text "a" ], text ". You won’t get confused when you see ", code [] [ text "a :: Matrix 3 3" ], text ". It’s scientifically impossible. When we put everything together and run it we get the results that we hope for" ]
                , pre [] [ code [] [ text "λ: 5.7912016 0: 0.7802645 1: 0.28464365 2: 0.55692476\nλ: 2.9946988 0: -4.2912193e-2 1: 0.90928996 2: -0.41394478" ] ]
                , p [] [ text "Isn’t this lovely? I think it is lovely. Our linear algebra system is perfectly well typed ", em [] [ text "and" ], text " we still have the incredible flexibiliy offered by defining matrices and vectors in terms of functions. Need an identity matrix? Here’s a perfectly typed identity matrix." ]
                , pre [] [ code [] [ text "identity :: Matrix a a\nidentity i j = if i == j then 1 else 0" ] ]
                , p [] [ text "Too easy." ]
                , p [] [ text "Before wrapping up, here is the full source code you can use to experiment with yourself." ]
                , pre [] [ code [] [ text "{-# LANGUAGE ScopedTypeVariables #-}\n{-# LANGUAGE DataKinds #-}\n{-# LANGUAGE TypeApplications #-}\n\nmodule Main where\n\nimport GHC.TypeLits\nimport Data.Finite\nimport Data.Maybe\nimport Data.List\nimport Control.Monad\n\ntype Vector a = Finite a -> Float\ntype Matrix a b = Finite a -> Finite b -> Float\n\ncontract :: forall a. KnownNat a => Vector a -> Float\ncontract f = sum (map f finites)\n\nmmadd :: Matrix a b -> Matrix a b -> Matrix a b\nmmadd m n i j = m i j + n i j\n\nmmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c) => Matrix a b -> Matrix b c -> Matrix a c\nmmmul m n i j = contract (\\k -> m i k * n k j)\n\nmvmul :: forall a b. (KnownNat a, KnownNat b) => Matrix a b -> Vector b -> Vector a\nmvmul m v i = contract (\\k -> m i k * v k)\n\nsmmul :: Float -> Matrix a b -> Matrix a b\nsmmul s m i j = s * m i j\n\nsvmul :: Float -> Vector a -> Vector a\nsvmul s v i = s * v i\n\ndot :: forall a. KnownNat a => Vector a -> Vector a -> Float\ndot v w = contract (\\k -> v k * w k)\n\nmagnitude :: forall a. KnownNat a => Vector a -> Float\nmagnitude v = (contract (\\k -> (v k)**2))**0.5\n\nnormalize :: forall a. KnownNat a => Vector a -> Vector a\nnormalize v = svmul (1 / (magnitude v)) v\n\nouter :: Vector a -> Vector b -> Matrix a b\nouter v w i j = v i * w j\n\nvfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)\nvfromlist l = do\n  guard (length l == length (finites @n))\n  pure (\\i -> l !! getFinite i)\n\nmfromlist :: forall n m. (KnownNat n, KnownNat m) => [[Float]] -> Maybe (Matrix n m)\nmfromlist l = do\n  guard (length l == length (finites @n))\n  ls <- sequence (fmap vfromlist l)\n  pure (\\i -> ls !! getFinite i)\n\npowerIteration :: forall a. KnownNat a => Vector a -> Matrix a a -> (Float, Vector a)\npowerIteration b0 m =\n  let\n    loop :: Int -> Vector a -> Vector a\n    loop 0 b' = b'\n    loop i b' = loop (i-1) (normalize (mvmul m b'))\n    b :: Vector a\n    b = loop 5 b0\n    eigenvalue :: Float\n    eigenvalue = dot b (mvmul m b)\n  in (eigenvalue, b)\n\ndeflate :: forall a. KnownNat a => Matrix a a -> Float -> Vector a -> Matrix a a\ndeflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))\n\na :: Matrix 3 3\nJust a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]\n\nb0 :: Vector 3\nJust b0 = vfromlist([1,2,3])\n\ne1 :: (Float, Vector 3)\ne1 = powerIteration b0 a\na_deflated :: Matrix 3 3\na_deflated = deflate a (fst e1) (snd e1)\ne2 :: (Float, Vector 3)\ne2 = powerIteration b0 a_deflated\n\ndisplay :: (Float, Vector 3) -> String\ndisplay (eval, evec) = \"λ: \" ++ show eval ++ \" \" ++ intercalate \" \" (map (\\i -> show (getFinite i) ++ \": \" ++ show (evec i)) finites)\n\nmain :: IO ()\nmain = do putStrLn (display e1)\n          putStrLn (display e2)" ] ]
                , p [] [ text "If you try running this code you will notice there is one very minor drawback to this implementation. Memoizing is unfortunately not as braindead simple in Haskell as it is in python, so i haven’t implemented it. I don’t even really have a good idea how to implement it yet in a way that sparks joy. Obviously this code ", em [] [ text "could" ], text " be memoized, but I’m not sure how to do it without sacrificing the semantic clarity we’ve gained from turning everything into functions. And if we lose the simplicity then we’ve lost a lot of the draw of this approach." ]
                , p [] [ text "So there is still work to do." ]
                , p [] [ text "Nevertheless! We have from the original essay a fairly performant memoized implementation of functional linear algebra. And we have in this appendix a very nicely typed implementation of functional linear algebra. The technique works." ]
                , p [] [ text "And we still haven’t installed numpy." ]
                , p [] [ text "Good job team." ]
                , p [] [ em [] [ text "For more, check out the second appendix to this essay: ", a [ href "/FNLINALGMEMO" ] [ text "Functional Linear Algebra, Memoized" ] ] ]
                ]
    , update = \_ model -> ( model, Cmd.none )
    }


article : Article
article =
    { title = "Functional Linear Algebra, with Types"
    , publicationDate = fromPosix utc (millisToPosix 1726596000000)
    , moduleName = "FunctionalLinearAlgebraWithTypes"
    , primaryUrl = "/FNLINALGTYPED"
    }
