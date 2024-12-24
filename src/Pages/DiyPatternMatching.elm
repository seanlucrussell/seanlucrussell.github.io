module Pages.DiyPatternMatching exposing (..)

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
                [ blogHeading (text "DIY Pattern Matching") article.publicationDate
                , p [] [ text "Today I’m going to tell you about the coolest thing I’ve discovered in the last year." ]
                , p [] [ text "Algebraic data types with pattern matching are one of the best language features out there right now. They make Rust and Haskell really easy to use. They make it easy to manage error handling, partial functions, embedded DSLs, any kind of tree data, complex control flow, and so much more. Once you rewire your brain to think in terms of ADTs you won’t wanna go back." ]
                , p [] [ text "Unfortunately, you will have to go back. You will inevitably find yourself having to write programs in languages that do not natively support pattern matching. Tragic." ]
                , p [] [ text "Except. And this is what I discovered recently. Quite a lot of languages actually support a DIY style of pattern matching. You can implement your own data types in just a few lines of code. And a LOT of languages let you do this. In fact any language that supports both" ]
                , ol []
                    [ li [] [ text "First class functions" ]
                    , li [] [ text "Records (aka tables, objects, dictionaries)" ]
                    ]
                , p [] [ text "then you can build your own pattern matching. The languages that have these features are many. I’ve confirmed this trick works in Python, Lua, Ruby, Clojure, Perl, and, funnily enough, Elm. It is easy to use and looks really clean." ]
                , p [] [ text "Lets see how to do a simple example in Javascript. Suppose we want to implement the Maybe datatype to make a safe division function. Since it really doesn’t require that much code, I’ll just show you the full thing and we will walk through it step-by-step" ]
                , pre [] [ code [] [ text "const Just = x => handler => handler.Just(x);\nconst Nothing = handler => handler.Nothing;\n\nconst match = (value, handler) => value(handler);\n\nfunction safeDivide(numerator, denominator) {\n    return denominator === 0 ? Nothing : Just(numerator / denominator);\n}\n\nfunction displayResult(maybeValue) {\n  const extractedValue = match(maybeValue, {\n    Just: result => `Result of division is ${result}`,\n    Nothing: `Handled divide by zero error`\n  });\n  console.log(extractedValue);\n}\n\nconst badDivision = safeDivide(5,0);\nconst goodDivision = safeDivide(22, 7);\n\ndisplayResult(badDivision);\ndisplayResult(goodDivision);" ] ]
                , p [] [ text "That’s the whole thing. You can paste it into node or your browser console and run it and you will see the output" ]
                , pre [] [ code [] [ text "Handled divide by zero error\nResult of division is 3.142857142857143" ] ]
                , p [] [ text "Pretty neat. So what is going on here?" ]
                , p [] [ text "The first two lines define our data type constructors. ", code [] [ text "Just" ], text " has two arguments in curried form, and ", code [] [ text "Nothing" ], text " has one. The final argument for both is the ", code [] [ text "handler" ], text ". We think of the value of a type ", code [] [ text "Maybe" ], text " as this later half of this: a ", code [] [ text "Maybe" ], text " value is a function that takes a handler as input and does something with it. What something? Well both ", code [] [ text "Maybe" ], text " and ", code [] [ text "Just" ], text " use the handler as an object, and between them the object has a field ", code [] [ text "Nothing" ], text " and a field ", code [] [ text "Just" ], text ". ", code [] [ text "Just" ], text " seems to store a function that takes a single argument as input, while ", code [] [ text "Nothing" ], text " could be any value." ]
                , p [] [ text "For an example, suppose we were to construct a value of ", code [] [ text "Just(5)" ], text ". What would we get? A new value, ", code [] [ text "handler => handler.Just(5)" ], text ". This is a function that takes an object that has a field ", code [] [ text "Just" ], text ". ", code [] [ text "Just" ], text " contains a function, and we pass ", code [] [ text "handler.Just" ], text " the value 5." ]
                , p [] [ text "FYI if this seems majorly confusing don’t worry. ", code [] [ text "Just" ], text " and ", code [] [ text "Nothing" ], text ", as keywords, are getting used in both the handler and the constructor. This is to make everything look nice when we are using them for programming, but it can make the comprehension a little bit challenging." ]
                , p [] [ text "The third line, ", code [] [ text "match" ], text ", is syntax sugar to make pattern matching plesant. A ", code [] [ text "maybe" ], text " value is a function from a handler to some data. ", code [] [ text "match" ], text " hides that weird detail from the user and does the calling for us." ]
                , p [] [ text "In ", code [] [ text "safeDivide" ], text " we get to the first usage of our data types. If you are at all familiar with algebraic data then this will be easy. Using a ternary operator, we check if the denominator is zero. If it is we return ", code [] [ text "Nothing" ], text ", if it isn’t we return the result of division wrapped in a ", code [] [ text "Just" ], text "." ]
                , p [] [ text "Likewise ", code [] [ text "displayResult" ], text " is a very standard use of algebraic data. We pattern match on ", code [] [ text "maybeValue" ], text " and handle the two cases: where the value contains ", code [] [ text "Just" ], text " some data and where the value contains ", code [] [ text "Nothing" ], text ". This will look pretty familiar at a casual reading, but there are some mild differences." ]
                , p [] [ text "The handler is an object. It is an object with two labels representing the two cases. So overall the handler looks like ", code [] [ text "{ Just: ..., Nothing: ... }" ], text " with relevant data. This is slightly different from traditional pattern matching. We don’t do destructuring in the pattern match on the labels. Instead we emulate destructuring by writing the appropriate functions. This is almost like using a continuation passing style, if that helps with intuition. We \"", text "destructure", text "\" by writing a continuation." ]
                , p [] [ text "Okay so we’ve got this basic setup. Let us manually run through the examples to see what happens. I’m going to be super verbose and manually walk through the evaluations of the ", code [] [ text "goodDivision" ], text " code. The ", code [] [ text "badDivision" ], text " execution trace is left as an exercise for the reader." ]
                , pre [] [ code [] [ text "goodDivision = safeDivide(22,7);\n// inline safeDivide\ngoodDivision = 0 === 0 ? Nothing : Just(22/7);\n// evaluate ternary expression\ngoodDivision = Just(22/7);\n// inline definition of Nothing\ngoodDivision = handler => handler.Just(22/7);" ] ]
                , p [] [ text "Now we have the value of ", code [] [ text "goodDivision" ], text ", lets pass it to ", code [] [ text "displayResult" ] ]
                , pre [] [ code [] [ text "displayResult(goodDivision);\n\n// inline displayResult\nconst extractedValue = match(goodDivision, {\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// inline match\nconst extractedValue = goodDivision({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// inline definition of badDivision\nconst extractedValue = (handler => handler.Just(22/7)) ({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// evaluate function call\nconst extractedValue = ({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n}.Just)(22/7);\nconsole.log(extractedValue);\n\n// execute field lookup\nconst extractedValue = (result => `Result of division is ${result}`)(22/7);\nconsole.log(extractedValue);\n\n// evaluate function call\nconst extractedValue = `Result of division is ${22/7}`;\nconsole.log(extractedValue);\n\n// print to console\nconsole.log(`Result of division is ${22/7}`);" ] ]
                , p [] [ text "We did the division safely and everyone is happy." ]
                , p [] [ text "This idea is by no means limited to ", code [] [ text "Maybe" ], text " types either. All sorts of algebraic data can be encoded with this pattern. For example, lets look at embedding a simple arithmetic language with addition, multiplication, numeric literals, equality tests, and branching." ]
                , pre [] [ code [] [ text "const Add = (x,y) => handler => handler.Add(x,y);\nconst Multiply = (x,y) => handler => handler.Multiply(x,y);\nconst Literal = x => handler => handler.Literal(x);\nconst Equal = (x,y) => handler => handler.Equal(x,y);\nconst Cond = (condition,x,y) => handler => handler.Cond(condition,x,y);" ] ]
                , p [] [ text "There we go. New data type built. We don’t have to define a new ", code [] [ text "match" ], text " function because ", code [] [ text "match" ], text " was always generic. And now we can write a pretty printer" ]
                , pre [] [ code [] [ text "function prettyPrint(expression) {\n  return match(expression, {\n    Add: (x,y) => \"(\" + prettyPrint(x) + \"+\" + prettyPrint(y) + \")\",\n    Multiply: (x,y) => \"(\" + prettyPrint(x) + \"*\" + prettyPrint(y) + \")\",\n    Literal: x => x.toString(),\n    Equal: (x,y) => \"(\" + prettyPrint(x) + \"==\" + prettyPrint(y) + \")\",\n    Cond: (condition,x,y) => \"(if \" + prettyPrint(condition) + \" then \" + prettyPrint(x) + \" else \" + prettyPrint(y) + \")\"\n  });\n}" ] ]
                , p [] [ text "and use it" ]
                , pre [] [ code [] [ text "prettyPrint(\n  Cond(\n    Equal(\n      Literal(4),\n      Add(\n        Literal(2),\n        Literal(2))),\n    Literal(1),\n    Literal(0)));" ] ]
                , p [] [ text "Now you know one of my better secrets. This pattern transports to all sorts of languages and all sorts of data types. You could write your own libraries using this stuff. You can cover the world in algebra." ]
                , p [] [ text "In fact that is what I hope you’ll do. Algebraic data types are one of the best features of modern languages. Since this trick lets us implement them in languages that don’t natively support them, we can spread the gospel of algebra to all those who haven’t yet heard the good word. Convert the unelightened. Remake the world into a new order." ]
                , p [] [ text "Or you can just think of this as a neat trick." ]
                , p [] [ text "Up to you." ]
                ]
    , update = \_ model -> ( model, Cmd.none )
    }


article : Article
article =
    { title = "DIY Pattern Matching"
    , publicationDate = fromPosix utc (millisToPosix 1735066800000)
    , moduleName = "DiyPatternMatching"
    , primaryUrl = "/DIYPTRNMATCH"
    }
