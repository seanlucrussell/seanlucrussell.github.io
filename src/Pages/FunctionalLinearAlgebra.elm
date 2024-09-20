module Pages.FunctionalLinearAlgebra exposing (..)

import Components exposing (blogHeading)
import Date exposing (fromPosix)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)
import Json.Encode as Encode
import Sitewide.Types exposing (Article, Page)
import Time exposing (Month(..), millisToPosix, utc)


page : Page
page =
    { view =
        \_ ->
            Html.Styled.article []
                [ blogHeading (text "Functional Linear Algebra") article.publicationDate
                , p [] [ text "Today we are learning how to implement all the basic operations of linear algebra for ourselves! Why? Well I was trying to learn how to find eigenvalues of a matrix today but the computer I was working on didn’t have numpy installed already and I was to lazy to set it up so I decided to implement all the linear algebra operations I needed from scratch. So now you are in this with me too." ]
                , p [] [ text "Also we are going to do it in a super weird way. I’ve been thinking of a way to express linear algebra using a more functional style, something vaguely reminiscent of the church encoding for data. If you don’t know what that is don’t worry about it, you can look it up after reading. Not a prerequisite at all. I just mean that we are going to be using functions to represent data, in this case matrices and vectors, instead of using lists." ]
                , p [] [ text "I don’t feel like delaying the big reveal, so here is the code." ]
                , pre [] [ code [] [ text "# some basic definitions\ndims = [0,1,2]\ncontract = lambda f: sum(f(k) for k in dims)\n\n# basic arithmetic operations on scalars, vectors, and matrices\nmmadd = lambda m,n:\n  lambda i,j: m(i,j)+n(i,j)\nmmmul = lambda m,n:\n  lambda i,j: contract(lambda k: m(i,k)*n(k,j))\nmvmul = lambda m,v:\n  lambda i: contract(lambda k: m(i,k)*v(k))\nsmmul = lambda s,m:\n  lambda i,j: s*m(i,j)\nsvmul = lambda s,v:\n  lambda i: s*v(i)\n\n# linear algebra operations\ndot = lambda v,w:\n  contract(lambda k: v(k)*w(k))\nmagnitude = lambda v:\n  (contract(lambda k:v(k)**2))**0.5\nnormalize = lambda v:\n  svmul(1/magnitude(v), v)\nouter = lambda v,w:\n  lambda i,j: v(i)*w(j)\n\n# convert lists into functions\nmfromlist = lambda l: lambda i,j: l[i][j]\nvfromlist = lambda l: lambda i: l[i]" ] ]
                , p [] [ text "This stuff is the basic linear algebra \"", text "library", text "\" in python 3. I only implemented the features I needed to do the eigenvalue calculations, demonstrated below." ]
                , pre [] [ code [] [ text "# Eigenvalue/eigenvector calculation\ndef power_iteration(A):\n    b = vfromlist([1,2,3])\n    for _ in range(1000):\n        b = normalize(mvmul(A,b))\n    eigenvalue = dot(b,mvmul(A,b))\n    return eigenvalue, b\n\ndef deflate(A, eigenvalue, eigenvector):\n    return mmadd(\n        A,\n        smmul(-eigenvalue, outer(eigenvector, eigenvector))\n    )\n\neigenvalue_1, eigenvector_1 = power_iteration(A)\nA_deflated = deflate(A, eigenvalue_1, eigenvector_1)\neigenvalue_2, eigenvector_2 = power_iteration(A_deflated)\n\nA = mfromlist([[4,1,2],[1,3,0],[2,0,3]])\n\n# display the results of our calculation\ndef display(val, vec):\n    print(\n        f\"λ: {val:.2f}\",\n        *(f'x{i}: {vec(i):.2f}' for i in dims)\n    )\ndisplay(eigenvalue_1, eigenvector_1)\ndisplay(eigenvalue_2, eigenvector_2)" ] ]
                , p [] [ text "Let us discuss." ]
                , p [] [ text "First, you will notice we have got quite a lot of lambdas running about. Some may say that the code is not particularly \"", text "pythonic", text "\", but we can ignore those people. This is unmistakably how the language was meant to be used." ]
                , p [] [ text "How so? Let us consider what a matrix \"", text "is", text "\". We often think about it as a grid of values." ]
                , node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool True ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "\n\\begin{bmatrix}3.1 & 2.8 & 5.5 \\\\ 1.0 & 3.5 & 5.5\\end{bmatrix}\n"] []
                , p [] [ text "But what is a grid but a function? We can represent this 2 by 3 grid as a function defined over pairs of integers. Maybe we call our function ", node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool False ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "WhatIsInCell(i,j)"] [], text ". For example in this case we will find ", node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool False ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "WhatIsInCell(2,1) = 1.0"] [], text ". Row 2, column 1 has the value ", node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool False ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "1.0"] [], text ". Don’t overthink it. A matrix is a function that takes two indices as arguments and produces a scalar as output. A vector is the same but with just one argument." ]
                , p [] [ text "We can write this out explicitly. It’s kind of tedious, but check this" ]
                , node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool True ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "\nM_{ij} = WhatIsInCell(i,j) =\n\\begin{cases}\n3.1 &\\text{if } i = 1 \\text{ and } j = 1\n\\\\\n2.8 &\\text{if } i = 1 \\text{ and } j = 2\n\\\\\n5.5 &\\text{if } i = 1 \\text{ and } j = 3\n\\\\\n1.0 &\\text{if } i = 2 \\text{ and } j = 1\n\\\\\n3.5 &\\text{if } i = 2 \\text{ and } j = 2\n\\\\\n5.5 &\\text{if } i = 2 \\text{ and } j = 3\n\\end{cases}\n"] []
                , p [] [ text "That’s a function!" ]
                , p [] [ text "What would happen if we took this observation way more seriously than it deserves? We come up with a pretty weird and in some ways extremely elegant way to describe linear algebra. Vectors are functions. Matrices are functions. Matrix-vector multiplication takes two functions and yields a new function. The dot product takes two functions and gets us a scalar. And so on." ]
                , p [] [ text "To dip our toes in, let’s look at scalar-vector multiplication." ]
                , pre [] [ code [] [ text "svmul = lambda s,v: lambda i: s * v(i)" ] ]
                , p [] [ text "This is a function that takes a scalar ", code [] [ text "s" ], text " and a vector ", code [] [ text "v" ], text " (AKA a function from an index to a scalar) and returns a function from an index ", code [] [ text "i" ], text " to a scalar (AKA a vector). If you look at this for a while you can probably see why it is equivalent to the more standard definition." ]
                , node "katex-expression" [ attribute "katex-options" (Encode.encode 0 (Encode.object [ ( "displayMode", Encode.bool True ), ( "throwOnError", Encode.bool False ) ])), attribute "expression" "\n(s\\vec v)_i = s(\\vec v_i)\n"] []
                , p [] [ text "We can do the same thing to define all the basic arithmetic operations on scalars, vectors, and matrices. In our library we use prefixes to identify the different operations, for example ", code [] [ text "mmadd" ], text " is matrix-matrix addition, ", code [] [ text "svmul" ], text " is scalar-vector multiplication, etc." ]
                , p [] [ text "If you look at the definitions for some of our operations, you’ll notice a weird operation called ", code [] [ text "contract" ], text ". This is used in definining the matrix vector product, the dot product, and the magnitude of vectors. This utility is loosely analogous to the idea of tensor contraction though it is perhaps more general and less theoretically justified. There are a lot of linear algebra operations where we want to accumulate via a sum the values across indices. We factor this commonality out into the ", code [] [ text "contract" ], text " construct." ]
                , p [] [ text "You may notice one of the main weaknesses of our system as it is currently specified in this ", code [] [ text "contract" ], text " function. In order to contract across indices we need to iterate across those indices. We’ve hard coded the indices here to only describe three dimensional space. That seems bad." ]
                , p [] [ text "Fortunately this is not a fundamental weakness of this technique. I’m just lazy. The right way to fix this is to describe some sort of \"", text "index", text "\" interface instead of using plain integers. We might describe indices by an object that implements the iterator for us, for instance. In theory you could even give nice typing rules to these iterators so that we can describe a matrix or vector in terms of the types of their iterators and so that our matrix and vector operations preserve well typed semantics." ]
                , p [] [ text "But like I said I’m lazy so this will wait for another day." ]
                , p [] [ text "There is one other glaring issue that you will have noticed if you’ve tried running this code. It is quite horribly slow. This is because we aren’t caching intermediate results. Every time we look up the value of some vector index, we are rerunning all the computations that describe that index. But once again this is possible to solve, and arguably even easier than the dimensionality thing I discussed before. A pretty brain-dead memoization of the core library makes it so our computer that struggls to churn through 7 iterations of the power iteration algorithm will instantly compute a thousand iterations once memoized." ]
                , pre [] [ code [] [ text "def memoize(f):\n    cache = {}\n    def memoized_function(*args):\n        if args not in cache: cache[args] = f(*args)\n        return cache[args]\n    return memoized_function\n\ncontract = lambda f: sum(f(k) for k in dims)\nmmadd = lambda m, n:\n  memoize(lambda i, j: m(i,j) + n(i,j))\nmmmul = lambda m, n:\n  memoize(lambda i, j: contract(lambda k: m(i,k) * n(k,j)))\nmvmul = lambda m, v:\n  memoize(lambda i: contract(lambda k: m(i,k) * v(k)))\nsmmul = lambda s, m:\n  memoize(lambda i, j: s * m(i,j))\nsvmul = lambda s, v:\n  memoize(lambda i: s * v(i))\ndot = lambda v, w: contract(lambda k: v(k) * w(k))\nmagnitude = lambda v: (contract(lambda k: v(k) ** 2)) ** 0.5\nnormalize = lambda v: svmul(1 / magnitude(v), v)\nouter = lambda v, w:\n  memoize(lambda i, j: v(i) * w(j))\nmfromlist = lambda l:\n  memoize(lambda i,j: l[i][j])\nvfromlist = lambda l:\n  memoize(lambda i: l[i])" ] ]
                , p [] [ text "Substitute this memoized version of the library for the original without making any changes and see instant massive performance gains." ]
                , p [] [ text "So this system totally works. Very cool. If you are like me you probably think this is cool enough on its own merits, but just to be explicit let us enumerate the reasons this approach might me interesting explicitly. As far as I’ve thought through there are three of them. First, portability. Second, simplicity. Third, insight." ]
                , p [] [ text "Starting with portability. You might find yourself wanting to perform some linear algebra in a place that is hostile to linear algebra. Maybe you are doing some in browser stuff with javascript and don’t want to load a full library for some lightweight operations. Copy in twenty or so lines of code and you’ve got yourself a basic linear algebra system anywhere you like. This is a pretty narrow use case but it’s still kind of fun." ]
                , p [] [ text "Second is simplicity. Many, many interesting matrix operations are expressed more naturally as functions to be quite honest. For example we can construct an identity matrix very cleanly using this functional style: ", code [] [ text "identity = lambda i,j: 1 if i == j else 0" ], text ". Technically in Python we could even use implicit boolean conversion to write this ", code [] [ text "identity = lambda i,j: i == j" ], text " but implicit casting like that gives me the creeps. Or suppose we want a constant vector - this is easily written as ", code [] [ text "vconstant = lambda n: lambda i: n" ], text ". Or perhaps we want to test two vectors for equality with ", code [] [ text "vequal = lambda v, w: contract(lambda k: abs(v(k) - w(k))) == 0" ], text ". We skipped defining the transpose of a matrix because we didn’t need it, but if we did we could write ", code [] [ text "transpose = lambda m: lambda i,j: m(j,i)" ], text ". This concept also works particularly well to represent sparse matrices which could have considerable performance implications for the right contexts. And because we are using such basic primitive operations it is easy to build up new and more exotic kinds of operations. Instead of having a million library functions to describe direct sums, constant matrices, pointwise nonlinear operations, etc etc etc, we can directly specify them ourselves. I’m a control freak so I find this to be a nice advantage of this style. If you are looking for heavily optimized linear algebra routines this is obviously not the correct style, but if you are looking to do more exploratory and experimental work the flexibility offered by this functional approach to linear algebra is pretty hard to beat, so far as I’ve seen." ]
                , p [] [ text "This leads into the third benefit I’m aware of. Insight." ]
                , p [] [ text "I’m a firm believer that seeing the same concepts from dozens of different angles gives you a much deeper understanding of that concept than accepting the one standard approach. This functional approach is very nonstandard. I’m still playing with all of this so I’m not quite sure exactly ", em [] [ text "what" ], text " those insights might be. Though the centrality of the contraction operation here does give me warm and fuzzy feelings about Einsten notation for tensors." ]
                , p [] [ text "But perhaps more than simply seeing things from a different perspective we gain insight by tinkering and experimentation. Like I said, this approach is extremely flexible. It took me just a few hours to develop this entire approach from scratch and implement the power iteration algorithm in it. Next time I will be even faster. There is no better educational technique than hands-on experimentation and the functional linear algebra approach is the best approach I’ve ever come across for doing it yourself." ]
                , p [] [ text "So there you have it! You are now in posession of a very weird approach to implementing linear algebra in any language that supports first class functions. Impress your friends, frighten your enemies, and awe the world with the power of functional linear algebra." ]
                , p [] [ em [] [ text "For more, check out the appendices to this essay: ", a [ href "/FNLINALGTYPED" ] [ text "Functional Linear Algebra, With Types" ], text " and ", a [ href "/FNLINALGMEMO" ] [ text "Functional Linear Algebra, Memoized" ] ] ]
                ]
    , update = \_ model -> ( model, Cmd.none )
    }


article : Article
article =
    { title = "Functional Linear Algebra"
    , publicationDate = fromPosix utc (millisToPosix 1726423200000)
    , moduleName = "FunctionalLinearAlgebra"
    , primaryUrl = "/FNLINALG"
    }
