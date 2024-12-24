---
moduleName: DiyPatternMatching
primaryUrl: "/DIYPTRNMATCH"
static: True
date: 2024-12-24
---

# DIY Pattern Matching

Today I'm going to tell you about the coolest thing I've discovered in the last year.

Algebraic data types with pattern matching are one of the best language features out there right now. They make Rust and Haskell really easy to use. They make it easy to manage error handling, partial functions, embedded DSLs, any kind of tree data, complex control flow, and so much more. Once you rewire your brain to think in terms of ADTs you won't wanna go back.

Unfortunately, you will have to go back. You will inevitably find yourself having to write programs in languages that do not natively support pattern matching. Tragic.

Except. And this is what I discovered recently. Quite a lot of languages actually support a DIY style of pattern matching. You can implement your own data types in just a few lines of code. And a LOT of languages let you do this. In fact any language that supports both

1. First class functions
2. Records (aka tables, objects, dictionaries)

will let you build your own pattern matching system. The languages that have these features are many. I've confirmed this trick works in Python, Lua, Ruby, Clojure, Perl, and, funnily enough, Elm. It is easy to use and looks really clean. The only drawback is that understanding how exaclty this works behind the scenes is a bit tricky, but you mostly don't have to worry about that.

Lets see how to do a simple example in Javascript. Suppose we want to implement the Maybe datatype to make a safe division function. Since it really doesn't require that much code, I'll just show you the full thing and we will walk through it step-by-step

```javascript
const Just = x => handler => handler.Just(x);
const Nothing = handler => handler.Nothing;

const match = (value, handler) => value(handler);

function safeDivide(numerator, denominator) {
    return denominator === 0 ? Nothing : Just(numerator / denominator);
}

function displayResult(maybeValue) {
  const extractedValue = match(maybeValue, {
    Just: result => `Result of division is ${result}`,
    Nothing: `Handled divide by zero error`
  });
  console.log(extractedValue);
}

const badDivision = safeDivide(5,0);
const goodDivision = safeDivide(22, 7);

displayResult(badDivision);
displayResult(goodDivision);
```

That's the whole thing. You can paste it into node or your browser console and run it and you will see the output

```
Handled divide by zero error
Result of division is 3.142857142857143
```

Pretty neat. So what is going on here?

The first two lines define our data type constructors. `Just` has two arguments in curried form, and `Nothing` has one. The final argument for both is the `handler`. We think of the value of a type `Maybe` as this later half of this: a `Maybe` value is a function that takes a handler as input and does something with it. What something? Well both `Maybe` and `Just` use the handler as an object, and between them the object has a field `Nothing` and a field `Just`. `Just` seems to store a function that takes a single argument as input, while `Nothing` could be any value.

For an example, suppose we were to construct a value of `Just(5)`. What would we get? A new value, `handler => handler.Just(5)`. This is a function that takes an object that has a field `Just`. `Just` contains a function, and we pass `handler.Just` the value 5.

FYI if this seems majorly confusing don't worry. `Just` and `Nothing`, as keywords, are getting used in both the handler and the constructor. This is to make everything look nice when we are using them for programming, but it can make the comprehension a little bit challenging.

The third line, `match`, is syntax sugar to make pattern matching plesant. A `maybe` value is a function from a handler to some data. `match` hides that weird detail from the user and does the calling for us.

In `safeDivide` we get to the first usage of our data types. If you are at all familiar with algebraic data then this will be easy. Using a ternary operator, we check if the denominator is zero. If it is we return `Nothing`, if it isn't we return the result of division wrapped in a `Just`.

Likewise `displayResult` is a very standard use of algebraic data. We pattern match on `maybeValue` and handle the two cases: where the value contains `Just` some data and where the value contains `Nothing`. This will look pretty familiar at a casual reading, but there are some mild differences.

The handler is an object. It is an object with two labels representing the two cases. So overall the handler looks like `{ Just: ..., Nothing: ... }` with relevant data. This is slightly different from traditional pattern matching. We don't do destructuring in the pattern match on the labels. Instead we emulate destructuring by writing the appropriate functions. This is almost like using a continuation passing style, if that helps with intuition. We "destructure" by writing a continuation.

Okay so we've got this basic setup. Let us manually run through the examples to see what happens. I'm going to be super verbose and manually walk through the evaluations of the `goodDivision` code. The `badDivision` execution trace is left as an exercise for the reader.

```
goodDivision = safeDivide(22,7);
// inline safeDivide
goodDivision = 0 === 0 ? Nothing : Just(22/7);
// evaluate ternary expression
goodDivision = Just(22/7);
// inline definition of Nothing
goodDivision = handler => handler.Just(22/7);
```

Now we have the value of `goodDivision`, lets pass it to `displayResult`

```
displayResult(goodDivision);

// inline displayResult
const extractedValue = match(goodDivision, {
  Just: result => `Result of division is ${result}`,
  Nothing: `Handled divide by zero error`
});
console.log(extractedValue);

// inline match
const extractedValue = goodDivision({
  Just: result => `Result of division is ${result}`,
  Nothing: `Handled divide by zero error`
});
console.log(extractedValue);

// inline definition of badDivision
const extractedValue = (handler => handler.Just(22/7)) ({
  Just: result => `Result of division is ${result}`,
  Nothing: `Handled divide by zero error`
});
console.log(extractedValue);

// evaluate function call
const extractedValue = ({
  Just: result => `Result of division is ${result}`,
  Nothing: `Handled divide by zero error`
}.Just)(22/7);
console.log(extractedValue);

// execute field lookup
const extractedValue = (result => `Result of division is ${result}`)(22/7);
console.log(extractedValue);

// evaluate function call
const extractedValue = `Result of division is ${22/7}`;
console.log(extractedValue);

// print to console
console.log(`Result of division is ${22/7}`);
```

We did the division safely and everyone is happy.

This idea is by no means limited to `Maybe` types either. All sorts of algebraic data can be encoded with this pattern. For example, lets look at embedding a simple arithmetic language with addition, multiplication, numeric literals, equality tests, and branching.

```
const Add = (x,y) => handler => handler.Add(x,y);
const Multiply = (x,y) => handler => handler.Multiply(x,y);
const Literal = x => handler => handler.Literal(x);
const Equal = (x,y) => handler => handler.Equal(x,y);
const Cond = (condition,x,y) => handler => handler.Cond(condition,x,y);
```

There we go. New data type built. We don't have to define a new `match` function because `match` was always generic. And now we can write a pretty printer

```
function prettyPrint(expression) {
  return match(expression, {
    Add: (x,y) => "(" + prettyPrint(x) + "+" + prettyPrint(y) + ")",
    Multiply: (x,y) => "(" + prettyPrint(x) + "*" + prettyPrint(y) + ")",
    Literal: x => x.toString(),
    Equal: (x,y) => "(" + prettyPrint(x) + "==" + prettyPrint(y) + ")",
    Cond: (condition,x,y) => "(if " + prettyPrint(condition) + " then " + prettyPrint(x) + " else " + prettyPrint(y) + ")"
  });
}
```

and use it

```
prettyPrint(
  Cond(
    Equal(
      Literal(4),
      Add(
        Literal(2),
        Literal(2))),
    Literal(1),
    Literal(0)));
```

Now you know one of my better secrets. This pattern transports to all sorts of languages and all sorts of data types. You could write your own libraries using this stuff. You can cover the world in algebra.

In fact that is what I hope you'll do. Algebraic data types are one of the best features of modern languages. Since this trick lets us implement them in languages that don't natively support them, we can spread the gospel of algebra to all those who haven't yet heard the good word. Convert the unelightened. Remake the world into a new order. 

Or you can just think of this as a neat trick.

Up to you.