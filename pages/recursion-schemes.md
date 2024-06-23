---
moduleName: "RecursionSchemes"
primaryUrl: "/REC"
date: 2023-01-06
static: True
---

# Recursion Schemes Are The Answer

But what is the question?

Since I've been learning about recursion schemes lately here is the version of recursion schemes that finally made sense to me. This leaves a lot of topics untouched, instead focusing on what I see as the core idea underlying the field. [This series by Patrick Thomson](https://blog.sumtypeofway.com/posts/introduction-to-recursion-schemes.html) is the most complete exposition about recursion schemes I have come across to date. And [this post by Jared Tobin](https://jtobin.io/practical-recursion-schemes) containing several practical examples of non-recursive recursive algorithms is what finally made the concept click for me.

Recursion schemes are all about removing recursion from datatypes and separating it out into standard recursive templates, "schemes" if you will, and reusing these schemes for every recursive datatype in existence.

But to ensure we are starting on solid ground let us be very clear what we mean by recursive datatypes by looking at a couple of the most common: linked lists and binary trees.

A linked list is a recursive datatype. By recursive we mean that a linked list can be built up from smaller linked lists. The list `[1,2,3]` is essentially the same as the first item, `1`, plus the rest of the list, `[2,3]`. The rest of the list can in turn be described as the first item (`2`) and an even smaller list (`[3]`), which is in turn a final item (`3`) and the smallest possible list (the empty list `[]`).

When we say a datatype is recursive we mean it can be built up from smaller copies of itself. The standard definition of a list involves defining the empty list and an operation for adding an item to the front of a preexisting list. We call these operations Nil and Cons respectively because that is what people decided on sixty years ago with lisp and no-one understands what the lisp people are doing well enough to challenge them.

Binary trees are the same. A binary tree can be built from a single leaf containing a value or it can be built from a pair of smaller trees. As with the linked list, the creation of a tree may require the input of smaller trees.

In Haskell syntax we'd write the linked list and tree definitions as `data List a = Nil | Cons a (List a)` and `data Tree a = Leaf a | Node (Tree a) (Tree a)` respectively.

So these types are recursive. Now that we know that let us do something silly. Lets see if we can make them non-recursive. Or at least as non-recursive as possible. And if you are asking why we'd do that right now I will kindly ask you to shut up and pretend like I haven't lost my mind.

Our list is recursive only in the second argument to Cons. What if we just made that a type variable? Why? I told you to stop asking questions.

Turning the recursive call in Cons into a type variable leaves us with `data List a f = Nil | Cons a f`. This seems totally useless but we can still technically create a list using this new type. See for example `Cons 3 (Cons 1 Nil)`.

Beware that we have somewhat changed behavior. The type of `Cons 3 (Cons 1 Nil)`, that is `List Int (List Int (List a f))` is now different from the type `(Cons 1 Nil)`, which is `List Int (List a f)`. Not to mention we get weird typing behavior that lets us write lists of mixed type like `Cons True (Cons 1 Nil)` or even weird tree like structures like `Cons (Cons 5 Nil) (Cons "baking soda" Nil)`.

So this is clearly less useful as a list than our original list. There may be some useful applications of it because this new type is in fact isomorphic to the type `Maybe (a,f)` which isn't an unreasonable type to see in the real world. But if types are changing based on the length of the list and we have hetrogeneous collections then we can't fairly say we have a list as the word 'list' is normally understood.

Clearly I haven't gone quite insane enough for this to make sense. So here is another type: `data Fix f = Fix (f (Fix f))`. This one is recursive. But I think it's the only recursive datatype we will need ever again.

I'm not going to elaborate on the reasoning behind the definition of this one. It was provided by divine providence as far as you are concerned. Lets just keep doing things like apply it to list datatype starting with the empty list constructor: `Fix Nil` gets us the type `Fix (List a)`.  If we make the following function `newCons x l = Fix (Cons x l)` and inspect its type we will see it is of type `a -> Fix (List a) -> Fix (List a)` which, barring the bizarre addition of `Fix`, is precisely the normal type signature for the Cons constructor. So `Fix (Cons 3 (Fix Nil)` will be of type `Fix (List Int)` and the type of a list no longer depends on the length of the list. And lists are back to being homogenous in the type of their contents.

Great! We've reinvented a normal list using an extremely confusing declaration, a few extra lines of code, and extra syntax interleaved in any list definition. To review, normally we'd write

```
data List a = Nil | Cons a (List a)

exampleList :: List String
exampleList = Cons "what" (Cons "is" (Cons "butter?" Nil))
```

but with this exciting new paradigm we would write

```
data List a f = Nil | Cons a f
data Fix f = Fix (f (Fix f))

exampleList :: Fix (List String)
exampleList = Fix (Cons "what" (Fix (Cons "is" (Fix (Cons "butter?" (Fix Nil))))))
```

We have successfully made our program worse. Huzzah! That's right, recursion schemes are just a fancy obfuscation tactic.

Actually, there is one way in which recursion schemes are better. Say we have this new fancy nonsense function that I'm not going to bother to explain as the purpose is obvious (this is called sarcasm)

```
cata :: Functor f => (f a -> a) -> Fix f -> a
cata f = f . fmap (cata f) . unfix
  where unfix :: Fix f -> f (Fix f)
        unfix (Fix x) = x
```

and since I'm just throwing things out there let's also give our non-recursive list a functor instance

```
instance Functor (List a) where
  fmap _ Nil = Nil
  fmap f (Cons a b) = Cons a (f b)
```

and define a random function on our list type

```
sum :: List Int Int -> Int
sum Nil = 0
sum (Cons a b) = a + b
```

Sequencing these things we can sum a list! Evaluating `cata sum (Fix (Cons 3 (Fix (Cons 4 (Fix Nil)))))` yields `7`. Very cool.

For the recursive list type we could have of course written

```
sum :: List Int -> Int
sum Nil = 0
sum (Cons a b) = a + sum b
```

This is a good place to once again take the score. For the traditional list we have

```
data List a = Nil | Cons a (List a)

sum :: List Int -> Int
sum Nil = 0
sum (Cons a b) = a + sum b
```

Weighing in at 5 lines of code this is all that is needed to define a list and the sum of a list. By contrast with our new fancy method using nonsense words we have

```
data List a f = Nil | Cons a f
data Fix f = Fix (f (Fix f))

cata :: Functor f => (f a -> a) -> Fix f -> a
cata f = f . fmap (cata f) . unfix
  where unfix :: Fix f -> f (Fix f)
        unfix (Fix x) = x

instance Functor (List a) where
  fmap _ Nil = Nil
  fmap f (Cons a b) = Cons a (f b)

sum :: Fix (List Int) -> Int
sum = cata assistant
  where assistant :: List Int Int -> Int
        assistant Nil = 0
        assistant (Cons a b) = a + b
```

Summing up to 15 lines of code. We've managed to triple the length of code required to take the sum of a list for no perceptible benefit. Super rad.

But wait. There *is* a small, very small, very very *very* small way in which the second is better than the first. One section of the sum function is ever so slightly simpler, not requiring a recursive call to the tail of the list to evaluate the sum.

But the sum is a recursive operation is it not?

It is indeed. Packed away in the mystery function `cata` and the `Functor` instance for `List a`  is all the recursion we need to implement the sum.

Ok, but we could totally just write a list fold for the normal list and factor out the recursion from the normal list sum. No need for all this nonsense.

Thats right. In fact that is essentially what we've done with the weird list. The function `cata` is a bizarre type of fold for our bizarre type of list.

Alright, time to actually do something cool with all this nonsense. Let's make a tree type using our dumb recursion-factoring methodology and give it its functor instance:

```
data Tree a f = Leaf a | Branch f f

instance Functor (Tree a) where
  fmap _ (Leaf x) = Leaf x
  fmap f (Branch a b) = Branch (f a) (f b)
```

If you play around with the `Tree a f` constructors for a while you'll see they behave similarly to the weird linked list: the tree will have different types depending on the depth of the tree. Plus there is some new weird behavior only possible with trees: each branch needs to be of the same depth in order for the tree to type check.

But if you use the `Fix` type, the same exact type we defined above, you'll start getting a normal tree again! See `Fix (Branch (Fix (Leaf 'f')) (Fix (Branch (Fix (Leaf 'f')) (Fix (Leaf 'f')))))` for example: while this tree has mixed branches you can see it is of type `Fix (Tree Char)` in a Haskell interpreter. The same exact Fix type, when applied to our completely new weird Tree type, has resulted in something essentially identical to the ordinary Tree definition.

But this goes deeper. Let's define a sum over our new Tree type

```
sum :: Fix (Tree Int) -> Int
sum = cata assistant
  where assistant :: Tree Int Int -> Int
        assistant (Leaf x) = x
        assistant (Branch a b) = a + b
```

Once again we attain a recursion-free sum. Applying it to an example tree `sum (Fix (Branch (Fix (Leaf 4)) (Fix (Branch (Fix (Leaf 3)) (Fix (Leaf 2))))))` yields a result of `9`.

Bizarre. We still have a lot of boilerplate with all the `Fix`es interleaved through everything and the functor instance. But the Fix type and the `cata` function worked for both the tree and the linked list.

And now we approach the heart of the utility of recursion schemes. For ANY recursive datatype, and that means ANY, we can go through this simple procedure:

1. Factor out the recursion
2. Create a functor instance
3. Apply the `cata` function to iterate over it

This is all very mechanical. Functor instances can be derived with normal haskell. `cata` never changes. Factoring out recursion can be accomplished with template haskell. Humans don't actually need to engage in any of this.

And then we can write fancy functions for much more sophisticated datatypes than the simple tree or list:

```
data Ring f
    = Zero
    | One
    | Invert f
    | Add f f
    | Multiply f f
    deriving (Functor)

evaluate :: Fix Ring -> Int
evaluate = cata assistant
  where assistant :: Ring Int -> Int
        assistant Zero = 0
        assistant One = 1
        assistant (Invert n) = -n
        assistant (Add a b) = a + b
        assistant (Multiply a b) = a * b
```

There we go. The `assistant` function here makes clear the essence of ring evaluation without any explicit recursion. I never had to write a fold anywhere (I'm using mathematical rings as a simple example of a domain specific language, don't worry too much about what a ring is). Compare `assistant` to a hypothetical recursive ring evaluation

```
evaluate Ring -> Int
evaluate Zero = 0
evaluate One = 1
evaluate (Invert n) = - (evaluate n)
evaluate (Add a b) = (evaluate a) + (evaluate b)
evaluate (Multiply a b) = (evaluate a) * (evaluate b)
```

and see that, ignoring all the other mess we've made, the `assistant` function is clearer. All the recursion in `assistant` is implicit and the general notion is obvious.

By the way all these functions I've been calling `assistant` are examples of what insiders call an F-Algebra, sometimes shortened to Algebra. It's a fancy name for a very simple concept. Anything of type `f a -> a` is an algebra. Complain to the mathematicians if this doesn't seem obvious to you.

There is likely one lingering thought you are having at this point. Sure, we can derive functor instances automatically. Sure, we can create non-recursive types automatically. Sure, `cata` and `Fix` work for all functors. But dealing with This:

```
Fix (Multiply (Fix (Add (Fix Unit) (Fix Zero))) (Fix One))
```

where half of our datastructure is just calls to `Fix` instead of This:

```
Multiply (Add Unit Zero) One
```

is simply not going to work. Semantically they might behave the same. But programs are a means for humans and computers to communicate with each other and that first version is just *awful* for communicating with humans. So recursion schemes are useless after all.

Unless we can find a way to use them with normal data types.

And this is the final piece of the puzzle. Just like it is fairly straightforward to automatically derive the functionality to generate a non-recursive type from a recursive type it is also straightforward to generate the functions that convert between the fixpoint of the non-recursive type and the original recursive type. For our lists

```
data NormalList a
    = NormalNil
    | NormalCons a (NormalList a)

data WeirdList a f 
    = WeirdNil
    | WeirdCons a f
```

that means we could auto-generate

```
from :: NormalList a -> Fix (WeirdList a)
to :: Fix (WeirdList a) -> NormalList a
```

and then use these functions to go back and forth between the real world and the upside-down world of recursion schemes. We can use `cata` when it is simpler and we can use our ordinary datatype when we prefer.

Finally we are at the point where this is all actually worthwhile:

1. We write a recursive datatype as we normally would
2. We import a library for managing recursion schemes
3. The recursion schemes library generates the non-recursive variant of our datatype
4. The library also generates the conversion functions
5. It also generates the functor instances
6. We write almost no boilerplate, can use our types as God intended, but we can also jump over to mystery recursion land to perform dark magic

And that is the secret to recursion schemes.

To review. The essential concept to understand recursion schemes is to view it as an exploration of factoring out recursion from our datatypes. When we look deep enough we discover that there is a purely mechanical process for performing this factorization that allows us to write elegant, non-recursive code and then apply it recursively.

Library writers then go off and write things like the `recursion-schemes` library that takes care of all this manual boiler plate for us so we get the best of both worlds; little incomprehensible nonsense code with all the power of recursion schemes.

## Conclusion

I hardly touched on what the recursion schemes really are. `cata` is the only example provided in this article. `cata` is in fact short for catamorphism, and it turns out there are a number of different ways to recurse through a datatype so there are a number of different functions akin to the catamorhism. They all have wild and exotic names like the zygomorphism or the histomorphism but they each boil down to strategies, schemes if you will, to recurse over a recursive datatype.

One particularly large weakness of recursion schemes is that they don't deal elegantly with mutually recursive datatypes. At least not that I've been able to divine. This is a real problem for things like programming languages where you'll often have mutually recursive datatypes like expressions and statements. There appears to be a number of attempts to expand recursion schemes to more flexible datatypes but it isn't clear to me that there is a winner in this battle yet.

I hope that the main takeaway of this article has come across. For me the essence of recursion schemes is the answer to a question: "What happens if we try to take away recursion from as much of a datatype as we possibly can?". Recursion schemes are the answer. And the answer turns out to be pretty cool.
