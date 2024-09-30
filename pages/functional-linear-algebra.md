---
moduleName: FunctionalLinearAlgebra
primaryUrl: "/FNLINALG"
static: True
math: True
date: 2024-09-15
---

# Functional Linear Algebra

Today we are learning how to implement all the basic operations of linear algebra for ourselves! Why? Well I was trying to learn how to find eigenvalues of a matrix today but the computer I was working on didn't have numpy installed already and I was to lazy to set it up so I decided to implement all the linear algebra operations I needed from scratch. So now you are in this with me too.

Also we are going to do it in a super weird way. I've been thinking of a way to express linear algebra using a more functional style. Instead of using data to represent data, we are going to be using functions to represent data. Instead of using lists to encode matrices and vectors, we will use functions.

I don't feel like delaying the big reveal, so here is the code.

```python
# some basic definitions
dims = [0,1,2]
contract = lambda f: sum(f(k) for k in dims)

# basic arithmetic operations on scalars, vectors, and matrices
mmadd = lambda m,n:
  lambda i,j: m(i,j)+n(i,j)
mmmul = lambda m,n:
  lambda i,j: contract(lambda k: m(i,k)*n(k,j))
mvmul = lambda m,v:
  lambda i: contract(lambda k: m(i,k)*v(k))
smmul = lambda s,m:
  lambda i,j: s*m(i,j)
svmul = lambda s,v:
  lambda i: s*v(i)

# linear algebra operations
dot = lambda v,w:
  contract(lambda k: v(k)*w(k))
magnitude = lambda v:
  (contract(lambda k:v(k)**2))**0.5
normalize = lambda v:
  svmul(1/magnitude(v), v)
outer = lambda v,w:
  lambda i,j: v(i)*w(j)

# convert lists into functions
mfromlist = lambda l: lambda i,j: l[i][j]
vfromlist = lambda l: lambda i: l[i]
```

This stuff is the basic linear algebra "library" in python 3. I only implemented the features I needed to do the eigenvalue calculations, demonstrated below.

```python
# Eigenvalue/eigenvector calculation
def power_iteration(A):
    b = vfromlist([1,2,3])
    for _ in range(1000):
        b = normalize(mvmul(A,b))
    eigenvalue = dot(b,mvmul(A,b))
    return eigenvalue, b

def deflate(A, eigenvalue, eigenvector):
    return mmadd(
        A,
        smmul(-eigenvalue, outer(eigenvector, eigenvector))
    )

eigenvalue_1, eigenvector_1 = power_iteration(A)
A_deflated = deflate(A, eigenvalue_1, eigenvector_1)
eigenvalue_2, eigenvector_2 = power_iteration(A_deflated)

A = mfromlist([[4,1,2],[1,3,0],[2,0,3]])

# display the results of our calculation
def display(val, vec):
    print(
        f"λ: {val:.2f}",
        *(f'x{i}: {vec(i):.2f}' for i in dims)
    )
display(eigenvalue_1, eigenvector_1)
display(eigenvalue_2, eigenvector_2)
```

Let us discuss.

First, you will notice we have got quite a lot of lambdas running about. Some may say that the code is not particularly "pythonic", but we can ignore those people. This is unmistakably how the language was meant to be used.

How so? Let us consider what a matrix "is". We often think about it as a grid of values.

$$
\begin{bmatrix}3.1 & 2.8 & 5.5 \\ 1.0 & 3.5 & 5.5\end{bmatrix}
$$

But what is a grid but a function? We can represent this 2 by 3 grid as a function defined over pairs of integers. Maybe we call our function $WhatIsInCell(i,j)$. For example in this case we will find $WhatIsInCell(2,1) = 1.0$. Row 2, column 1 has the value $1.0$. Don't overthink it. A matrix is a function that takes two indices as arguments and produces a scalar as output. A vector is the same but with just one argument.

We can write this out explicitly. It's kind of tedious, but check this

$$
M_{ij} = WhatIsInCell(i,j) =
\begin{cases}
3.1 &\text{if } i = 1 \text{ and } j = 1
\\
2.8 &\text{if } i = 1 \text{ and } j = 2
\\
5.5 &\text{if } i = 1 \text{ and } j = 3
\\
1.0 &\text{if } i = 2 \text{ and } j = 1
\\
3.5 &\text{if } i = 2 \text{ and } j = 2
\\
5.5 &\text{if } i = 2 \text{ and } j = 3
\end{cases}
$$

That's a function!

What would happen if we took this observation way more seriously than it deserves? We come up with a pretty weird and in some ways extremely elegant way to describe linear algebra. Vectors are functions. Matrices are functions. Matrix-vector multiplication takes two functions and yields a new function. The dot product takes two functions and gets us a scalar. And so on.

To dip our toes in, let's look at scalar-vector multiplication.

```python
svmul = lambda s,v: lambda i: s * v(i)
```

This is a function that takes a scalar `s` and a vector `v` (AKA a function from an index to a scalar) and returns a function from an index `i` to a scalar (AKA a vector). If you look at this for a while you can probably see why it is equivalent to the more standard definition.

$$
(s\vec v)_i = s(\vec v_i)
$$

We can do the same thing to define all the basic arithmetic operations on scalars, vectors, and matrices. In our library we use prefixes to identify the different operations, for example `mmadd` is matrix-matrix addition, `svmul` is scalar-vector multiplication, etc.

If you look at the definitions for some of our operations, you'll notice a weird operation called `contract`. This is used in definining the matrix vector product, the dot product, and the magnitude of vectors. This utility is loosely analogous to the idea of tensor contraction though it is perhaps more general and less theoretically justified. There are a lot of linear algebra operations where we want to accumulate via a sum the values across indices. We factor this commonality out into the `contract` construct.

You may notice one of the main weaknesses of our system as it is currently specified in this `contract` function. In order to contract across indices we need to iterate across those indices. We've hard coded the indices here to only describe three dimensional space. That seems bad.

Fortunately this is not a fundamental weakness of this technique. I'm just lazy. The right way to fix this is to describe some sort of "index" interface instead of using plain integers. We might describe indices by an object that implements the iterator for us, for instance. In theory you could even give nice typing rules to these iterators so that we can describe a matrix or vector in terms of the types of their iterators and so that our matrix and vector operations preserve well typed semantics.

But like I said I'm lazy so this will wait for another day.

There is one other glaring issue that you will have noticed if you've tried running this code. It is quite horribly slow. This is because we aren't caching intermediate results. Every time we look up the value of some vector index, we are rerunning all the computations that describe that index. But once again this is possible to solve, and arguably even easier than the dimensionality thing I discussed before. A pretty brain-dead memoization of the core library makes it so our computer that struggls to churn through 7 iterations of the power iteration algorithm will instantly compute a thousand iterations once memoized.

```python
def memoize(f):
    cache = {}
    def memoized_function(*args):
        if args not in cache: cache[args] = f(*args)
        return cache[args]
    return memoized_function

contract = lambda f: sum(f(k) for k in dims)
mmadd = lambda m, n:
  memoize(lambda i, j: m(i,j) + n(i,j))
mmmul = lambda m, n:
  memoize(lambda i, j: contract(lambda k: m(i,k) * n(k,j)))
mvmul = lambda m, v:
  memoize(lambda i: contract(lambda k: m(i,k) * v(k)))
smmul = lambda s, m:
  memoize(lambda i, j: s * m(i,j))
svmul = lambda s, v:
  memoize(lambda i: s * v(i))
dot = lambda v, w: contract(lambda k: v(k) * w(k))
magnitude = lambda v: (contract(lambda k: v(k) ** 2)) ** 0.5
normalize = lambda v: svmul(1 / magnitude(v), v)
outer = lambda v, w:
  memoize(lambda i, j: v(i) * w(j))
mfromlist = lambda l:
  memoize(lambda i,j: l[i][j])
vfromlist = lambda l:
  memoize(lambda i: l[i])
```

Substitute this memoized version of the library for the original without making any changes and see instant massive performance gains.

So this system totally works. Very cool. If you are like me you probably think this is cool enough on its own merits, but just to be explicit let us enumerate the reasons this approach might me interesting explicitly. As far as I've thought through there are three of them. First, portability. Second, simplicity. Third, insight.

Starting with portability. You might find yourself wanting to perform some linear algebra in a place that is hostile to linear algebra. Maybe you are doing some in browser stuff with javascript and don't want to load a full library for some lightweight operations. Copy in twenty or so lines of code and you've got yourself a basic linear algebra system anywhere you like. This is a pretty narrow use case but it's still kind of fun.

Second is simplicity. Many, many interesting matrix operations are expressed more naturally as functions to be quite honest. For example we can construct an identity matrix very cleanly using this functional style: `identity = lambda i,j: 1 if i == j else 0`. Technically in Python we could even use implicit boolean conversion to write this `identity = lambda i,j: i == j` but implicit casting like that gives me the creeps. Or suppose we want a constant vector - this is easily written as `vconstant = lambda n: lambda i: n`. Or perhaps we want to test two vectors for equality with `vequal = lambda v, w: contract(lambda k: abs(v(k) - w(k))) == 0`. We skipped defining the transpose of a matrix because we didn't need it, but if we did we could write `transpose = lambda m: lambda i,j: m(j,i)`. This concept also works particularly well to represent sparse matrices which could have considerable performance implications for the right contexts. And because we are using such basic primitive operations it is easy to build up new and more exotic kinds of operations. Instead of having a million library functions to describe direct sums, constant matrices, pointwise nonlinear operations, etc etc etc, we can directly specify them ourselves. I'm a control freak so I find this to be a nice advantage of this style. If you are looking for heavily optimized linear algebra routines this is obviously not the correct style, but if you are looking to do more exploratory and experimental work the flexibility offered by this functional approach to linear algebra is pretty hard to beat, so far as I've seen.

This leads into the third benefit I'm aware of. Insight.

I'm a firm believer that seeing the same concepts from dozens of different angles gives you a much deeper understanding of that concept than accepting the one standard approach. This functional approach is very nonstandard. I'm still playing with all of this so I'm not quite sure exactly *what* those insights might be. Though the centrality of the contraction operation here does give me warm and fuzzy feelings about Einsten notation for tensors.

But perhaps more than simply seeing things from a different perspective we gain insight by tinkering and experimentation. Like I said, this approach is extremely flexible. It took me just a few hours to develop this entire approach from scratch and implement the power iteration algorithm in it. Next time I will be even faster. There is no better educational technique than hands-on experimentation and the functional linear algebra approach is the best approach I've ever come across for doing it yourself.

So there you have it! You are now in posession of a very weird approach to implementing linear algebra in any language that supports first class functions. Impress your friends, frighten your enemies, and awe the world with the power of functional linear algebra.

*For more, check out the appendices to this essay: [Functional Linear Algebra, With Types](/FNLINALGTYPED) and [Functional Linear Algebra, Memoized](/FNLINALGMEMO)*