module Pages.RecursionSchemes exposing (..)

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
                [ blogHeading (text "Recursion Schemes Are The Answer") article.publicationDate
                , p [] [ text "But what is the question?" ]
                , p [] [ text "Since I’ve been learning about recursion schemes lately here is the version of recursion schemes that finally made sense to me. This leaves a lot of topics untouched, instead focusing on what I see as the core idea underlying the field. ", a [ href "https://blog.sumtypeofway.com/posts/introduction-to-recursion-schemes.html" ] [ text "This series by Patrick Thomson" ], text " is the most complete exposition about recursion schemes I have come across to date. And ", a [ href "https://jtobin.io/practical-recursion-schemes" ] [ text "this post by Jared Tobin" ], text " containing several practical examples of non-recursive recursive algorithms is what finally made the concept click for me." ]
                , p [] [ text "Recursion schemes are all about removing recursion from datatypes and separating it out into standard recursive templates, \"", text "schemes", text "\" if you will, and reusing these schemes for every recursive datatype in existence." ]
                , p [] [ text "But to ensure we are starting on solid ground let us be very clear what we mean by recursive datatypes by looking at a couple of the most common: linked lists and binary trees." ]
                , p [] [ text "A linked list is a recursive datatype. By recursive we mean that a linked list can be built up from smaller linked lists. The list ", code [] [ text "[1,2,3]" ], text " is essentially the same as the first item, ", code [] [ text "1" ], text ", plus the rest of the list, ", code [] [ text "[2,3]" ], text ". The rest of the list can in turn be described as the first item (", code [] [ text "2" ], text ") and an even smaller list (", code [] [ text "[3]" ], text "), which is in turn a final item (", code [] [ text "3" ], text ") and the smallest possible list (the empty list ", code [] [ text "[]" ], text ")." ]
                , p [] [ text "When we say a datatype is recursive we mean it can be built up from smaller copies of itself. The standard definition of a list involves defining the empty list and an operation for adding an item to the front of a preexisting list. We call these operations Nil and Cons respectively because that is what people decided on sixty years ago with lisp and no-one understands what the lisp people are doing well enough to challenge them." ]
                , p [] [ text "Binary trees are the same. A binary tree can be built from a single leaf containing a value or it can be built from a pair of smaller trees. As with the linked list, the creation of a tree may require the input of smaller trees." ]
                , p [] [ text "In Haskell syntax we’d write the linked list and tree definitions as ", code [] [ text "data List a = Nil | Cons a (List a)" ], text " and ", code [] [ text "data Tree a = Leaf a | Node (Tree a) (Tree a)" ], text " respectively." ]
                , p [] [ text "So these types are recursive. Now that we know that let us do something silly. Lets see if we can make them non-recursive. Or at least as non-recursive as possible. And if you are asking why we’d do that right now I will kindly ask you to shut up and pretend like I haven’t lost my mind." ]
                , p [] [ text "Our list is recursive only in the second argument to Cons. What if we just made that a type variable? Why? I told you to stop asking questions." ]
                , p [] [ text "Turning the recursive call in Cons into a type variable leaves us with ", code [] [ text "data List a f = Nil | Cons a f" ], text ". This seems totally useless but we can still technically create a list using this new type. See for example ", code [] [ text "Cons 3 (Cons 1 Nil)" ], text "." ]
                , p [] [ text "Beware that we have somewhat changed behavior. The type of ", code [] [ text "Cons 3 (Cons 1 Nil)" ], text ", that is ", code [] [ text "List Int (List Int (List a f))" ], text " is now different from the type ", code [] [ text "(Cons 1 Nil)" ], text ", which is ", code [] [ text "List Int (List a f)" ], text ". Not to mention we get weird typing behavior that lets us write lists of mixed type like ", code [] [ text "Cons True (Cons 1 Nil)" ], text " or even weird tree like structures like ", code [] [ text "Cons (Cons 5 Nil) (Cons \"baking soda\" Nil)" ], text "." ]
                , p [] [ text "So this is clearly less useful as a list than our original list. There may be some useful applications of it because this new type is in fact isomorphic to the type ", code [] [ text "Maybe (a,f)" ], text " which isn’t an unreasonable type to see in the real world. But if types are changing based on the length of the list and we have hetrogeneous collections then we can’t fairly say we have a list as the word \"", text "list", text "\" is normally understood." ]
                , p [] [ text "Clearly I haven’t gone quite insane enough for this to make sense. So here is another type: ", code [] [ text "data Fix f = Fix (f (Fix f))" ], text ". This one is recursive. But I think it’s the only recursive datatype we will need ever again." ]
                , p [] [ text "I’m not going to elaborate on the reasoning behind the definition of this one. It was provided by divine providence as far as you are concerned. Lets just keep doing things like apply it to list datatype starting with the empty list constructor: ", code [] [ text "Fix Nil" ], text " gets us the type ", code [] [ text "Fix (List a)" ], text ". If we make the following function ", code [] [ text "newCons x l = Fix (Cons x l)" ], text " and inspect its type we will see it is of type ", code [] [ text "a -> Fix (List a) -> Fix (List a)" ], text " which, barring the bizarre addition of ", code [] [ text "Fix" ], text ", is precisely the normal type signature for the Cons constructor. So ", code [] [ text "Fix (Cons 3 (Fix Nil)" ], text " will be of type ", code [] [ text "Fix (List Int)" ], text " and the type of a list no longer depends on the length of the list. And lists are back to being homogenous in the type of their contents." ]
                , p [] [ text "Great! We’ve reinvented a normal list using an extremely confusing declaration, a few extra lines of code, and extra syntax interleaved in any list definition. To review, normally we’d write" ]
                , pre [] [ code [] [ text "data List a = Nil | Cons a (List a)\n\nexampleList :: List String\nexampleList = Cons \"what\" (Cons \"is\" (Cons \"butter?\" Nil))" ] ]
                , p [] [ text "but with this exciting new paradigm we would write" ]
                , pre [] [ code [] [ text "data List a f = Nil | Cons a f\ndata Fix f = Fix (f (Fix f))\n\nexampleList :: Fix (List String)\nexampleList = Fix (Cons \"what\" (Fix (Cons \"is\" (Fix (Cons \"butter?\" (Fix Nil))))))" ] ]
                , p [] [ text "We have successfully made our program worse. Huzzah! That’s right, recursion schemes are just a fancy obfuscation tactic." ]
                , p [] [ text "Actually, there is one way in which recursion schemes are better. Say we have this new fancy nonsense function that I’m not going to bother to explain as the purpose is obvious (this is called sarcasm)" ]
                , pre [] [ code [] [ text "cata :: Functor f => (f a -> a) -> Fix f -> a\ncata f = f . fmap (cata f) . unfix\n  where unfix :: Fix f -> f (Fix f)\n        unfix (Fix x) = x" ] ]
                , p [] [ text "and since I’m just throwing things out there let’s also give our non-recursive list a functor instance" ]
                , pre [] [ code [] [ text "instance Functor (List a) where\n  fmap _ Nil = Nil\n  fmap f (Cons a b) = Cons a (f b)" ] ]
                , p [] [ text "and define a random function on our list type" ]
                , pre [] [ code [] [ text "sum :: List Int Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + b" ] ]
                , p [] [ text "Sequencing these things we can sum a list! Evaluating ", code [] [ text "cata sum (Fix (Cons 3 (Fix (Cons 4 (Fix Nil)))))" ], text " yields ", code [] [ text "7" ], text ". Very cool." ]
                , p [] [ text "For the recursive list type we could have of course written" ]
                , pre [] [ code [] [ text "sum :: List Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + sum b" ] ]
                , p [] [ text "This is a good place to once again take the score. For the traditional list we have" ]
                , pre [] [ code [] [ text "data List a = Nil | Cons a (List a)\n\nsum :: List Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + sum b" ] ]
                , p [] [ text "Weighing in at 5 lines of code this is all that is needed to define a list and the sum of a list. By contrast with our new fancy method using nonsense words we have" ]
                , pre [] [ code [] [ text "data List a f = Nil | Cons a f\ndata Fix f = Fix (f (Fix f))\n\ncata :: Functor f => (f a -> a) -> Fix f -> a\ncata f = f . fmap (cata f) . unfix\n  where unfix :: Fix f -> f (Fix f)\n        unfix (Fix x) = x\n\ninstance Functor (List a) where\n  fmap _ Nil = Nil\n  fmap f (Cons a b) = Cons a (f b)\n\nsum :: Fix (List Int) -> Int\nsum = cata assistant\n  where assistant :: List Int Int -> Int\n        assistant Nil = 0\n        assistant (Cons a b) = a + b" ] ]
                , p [] [ text "Summing up to 15 lines of code. We’ve managed to triple the length of code required to take the sum of a list for no perceptible benefit. Super rad." ]
                , p [] [ text "But wait. There ", em [] [ text "is" ], text " a small, very small, very very ", em [] [ text "very" ], text " small way in which the second is better than the first. One section of the sum function is ever so slightly simpler, not requiring a recursive call to the tail of the list to evaluate the sum." ]
                , p [] [ text "But the sum is a recursive operation is it not?" ]
                , p [] [ text "It is indeed. Packed away in the mystery function ", code [] [ text "cata" ], text " and the ", code [] [ text "Functor" ], text " instance for ", code [] [ text "List a" ], text " is all the recursion we need to implement the sum." ]
                , p [] [ text "Ok, but we could totally just write a list fold for the normal list and factor out the recursion from the normal list sum. No need for all this nonsense." ]
                , p [] [ text "Thats right. In fact that is essentially what we’ve done with the weird list. The function ", code [] [ text "cata" ], text " is a bizarre type of fold for our bizarre type of list." ]
                , p [] [ text "Alright, time to actually do something cool with all this nonsense. Let’s make a tree type using our dumb recursion-factoring methodology and give it its functor instance:" ]
                , pre [] [ code [] [ text "data Tree a f = Leaf a | Branch f f\n\ninstance Functor (Tree a) where\n  fmap _ (Leaf x) = Leaf x\n  fmap f (Branch a b) = Branch (f a) (f b)" ] ]
                , p [] [ text "If you play around with the ", code [] [ text "Tree a f" ], text " constructors for a while you’ll see they behave similarly to the weird linked list: the tree will have different types depending on the depth of the tree. Plus there is some new weird behavior only possible with trees: each branch needs to be of the same depth in order for the tree to type check." ]
                , p [] [ text "But if you use the ", code [] [ text "Fix" ], text " type, the same exact type we defined above, you’ll start getting a normal tree again! See ", code [] [ text "Fix (Branch (Fix (Leaf 'f')) (Fix (Branch (Fix (Leaf 'f')) (Fix (Leaf 'f')))))" ], text " for example: while this tree has mixed branches you can see it is of type ", code [] [ text "Fix (Tree Char)" ], text " in a Haskell interpreter. The same exact Fix type, when applied to our completely new weird Tree type, has resulted in something essentially identical to the ordinary Tree definition." ]
                , p [] [ text "But this goes deeper. Let’s define a sum over our new Tree type" ]
                , pre [] [ code [] [ text "sum :: Fix (Tree Int) -> Int\nsum = cata assistant\n  where assistant :: Tree Int Int -> Int\n        assistant (Leaf x) = x\n        assistant (Branch a b) = a + b" ] ]
                , p [] [ text "Once again we attain a recursion-free sum. Applying it to an example tree ", code [] [ text "sum (Fix (Branch (Fix (Leaf 4)) (Fix (Branch (Fix (Leaf 3)) (Fix (Leaf 2))))))" ], text " yields a result of ", code [] [ text "9" ], text "." ]
                , p [] [ text "Bizarre. We still have a lot of boilerplate with all the ", code [] [ text "Fix" ], text "es interleaved through everything and the functor instance. But the Fix type and the ", code [] [ text "cata" ], text " function worked for both the tree and the linked list." ]
                , p [] [ text "And now we approach the heart of the utility of recursion schemes. For ANY recursive datatype, and that means ANY, we can go through this simple procedure:" ]
                , ol []
                    [ li [] [ text "Factor out the recursion" ]
                    , li [] [ text "Create a functor instance" ]
                    , li [] [ text "Apply the ", code [] [ text "cata" ], text " function to iterate over it" ]
                    ]
                , p [] [ text "This is all very mechanical. Functor instances can be derived with normal haskell. ", code [] [ text "cata" ], text " never changes. Factoring out recursion can be accomplished with template haskell. Humans don’t actually need to engage in any of this." ]
                , p [] [ text "And then we can write fancy functions for much more sophisticated datatypes than the simple tree or list:" ]
                , pre [] [ code [] [ text "data Ring f\n    = Zero\n    | One\n    | Invert f\n    | Add f f\n    | Multiply f f\n    deriving (Functor)\n\nevaluate :: Fix Ring -> Int\nevaluate = cata assistant\n  where assistant :: Ring Int -> Int\n        assistant Zero = 0\n        assistant One = 1\n        assistant (Invert n) = -n\n        assistant (Add a b) = a + b\n        assistant (Multiply a b) = a * b" ] ]
                , p [] [ text "There we go. The ", code [] [ text "assistant" ], text " function here makes clear the essence of ring evaluation without any explicit recursion. I never had to write a fold anywhere (I’m using mathematical rings as a simple example of a domain specific language, don’t worry too much about what a ring is). Compare ", code [] [ text "assistant" ], text " to a hypothetical recursive ring evaluation" ]
                , pre [] [ code [] [ text "evaluate Ring -> Int\nevaluate Zero = 0\nevaluate One = 1\nevaluate (Invert n) = - (evaluate n)\nevaluate (Add a b) = (evaluate a) + (evaluate b)\nevaluate (Multiply a b) = (evaluate a) * (evaluate b)" ] ]
                , p [] [ text "and see that, ignoring all the other mess we’ve made, the ", code [] [ text "assistant" ], text " function is clearer. All the recursion in ", code [] [ text "assistant" ], text " is implicit and the general notion is obvious." ]
                , p [] [ text "By the way all these functions I’ve been calling ", code [] [ text "assistant" ], text " are examples of what insiders call an F-Algebra, sometimes shortened to Algebra. It’s a fancy name for a very simple concept. Anything of type ", code [] [ text "f a -> a" ], text " is an algebra. Complain to the mathematicians if this doesn’t seem obvious to you." ]
                , p [] [ text "There is likely one lingering thought you are having at this point. Sure, we can derive functor instances automatically. Sure, we can create non-recursive types automatically. Sure, ", code [] [ text "cata" ], text " and ", code [] [ text "Fix" ], text " work for all functors. But dealing with This:" ]
                , pre [] [ code [] [ text "Fix (Multiply (Fix (Add (Fix Unit) (Fix Zero))) (Fix One))" ] ]
                , p [] [ text "where half of our datastructure is just calls to ", code [] [ text "Fix" ], text " instead of This:" ]
                , pre [] [ code [] [ text "Multiply (Add Unit Zero) One" ] ]
                , p [] [ text "is simply not going to work. Semantically they might behave the same. But programs are a means for humans and computers to communicate with each other and that first version is just ", em [] [ text "awful" ], text " for communicating with humans. So recursion schemes are useless after all." ]
                , p [] [ text "Unless we can find a way to use them with normal data types." ]
                , p [] [ text "And this is the final piece of the puzzle. Just like it is fairly straightforward to automatically derive the functionality to generate a non-recursive type from a recursive type it is also straightforward to generate the functions that convert between the fixpoint of the non-recursive type and the original recursive type. For our lists" ]
                , pre [] [ code [] [ text "data NormalList a\n    = NormalNil\n    | NormalCons a (NormalList a)\n\ndata WeirdList a f \n    = WeirdNil\n    | WeirdCons a f" ] ]
                , p [] [ text "that means we could auto-generate" ]
                , pre [] [ code [] [ text "from :: NormalList a -> Fix (WeirdList a)\nto :: Fix (WeirdList a) -> NormalList a" ] ]
                , p [] [ text "and then use these functions to go back and forth between the real world and the upside-down world of recursion schemes. We can use ", code [] [ text "cata" ], text " when it is simpler and we can use our ordinary datatype when we prefer." ]
                , p [] [ text "Finally we are at the point where this is all actually worthwhile:" ]
                , ol []
                    [ li [] [ text "We write a recursive datatype as we normally would" ]
                    , li [] [ text "We import a library for managing recursion schemes" ]
                    , li [] [ text "The recursion schemes library generates the non-recursive variant of our datatype" ]
                    , li [] [ text "The library also generates the conversion functions" ]
                    , li [] [ text "It also generates the functor instances" ]
                    , li [] [ text "We write almost no boilerplate, can use our types as God intended, but we can also jump over to mystery recursion land to perform dark magic" ]
                    ]
                , p [] [ text "And that is the secret to recursion schemes." ]
                , p [] [ text "To review. The essential concept to understand recursion schemes is to view it as an exploration of factoring out recursion from our datatypes. When we look deep enough we discover that there is a purely mechanical process for performing this factorization that allows us to write elegant, non-recursive code and then apply it recursively." ]
                , p [] [ text "Library writers then go off and write things like the ", code [] [ text "recursion-schemes" ], text " library that takes care of all this manual boiler plate for us so we get the best of both worlds; little incomprehensible nonsense code with all the power of recursion schemes." ]
                , h2 [] [ text "Conclusion" ]
                , p [] [ text "I hardly touched on what the recursion schemes really are. ", code [] [ text "cata" ], text " is the only example provided in this article. ", code [] [ text "cata" ], text " is in fact short for catamorphism, and it turns out there are a number of different ways to recurse through a datatype so there are a number of different functions akin to the catamorhism. They all have wild and exotic names like the zygomorphism or the histomorphism but they each boil down to strategies, schemes if you will, to recurse over a recursive datatype." ]
                , p [] [ text "One particularly large weakness of recursion schemes is that they don’t deal elegantly with mutually recursive datatypes. At least not that I’ve been able to divine. This is a real problem for things like programming languages where you’ll often have mutually recursive datatypes like expressions and statements. There appears to be a number of attempts to expand recursion schemes to more flexible datatypes but it isn’t clear to me that there is a winner in this battle yet." ]
                , p [] [ text "I hope that the main takeaway of this article has come across. For me the essence of recursion schemes is the answer to a question: \"", text "What happens if we try to take away recursion from as much of a datatype as we possibly can?", text "\". Recursion schemes are the answer. And the answer turns out to be pretty cool." ]
                ]
    , update = \_ model -> ( model, Cmd.none )
    }


article : Article
article =
    { title = "Recursion Schemes Are The Answer"
    , publicationDate = fromPosix utc (millisToPosix 1673031600000)
    , moduleName = "RecursionSchemes"
    , primaryUrl = "/REC"
    }
