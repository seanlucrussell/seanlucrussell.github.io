#!/bin/bash

pandoc --extract-media=media --resource-path=pages/game-of-life -t build/pandoc-build-page-from-markdown.lua pages/game-of-life/game-of-life.md > src/Pages/GameOfLife.elm
pandoc --extract-media=media --resource-path=pages/the-guts-of-git -t build/pandoc-build-page-from-markdown.lua pages/the-guts-of-git/the-guts-of-git.md > src/Pages/TheGutsOfGit.elm
pandoc -t build/pandoc-build-page-from-markdown.lua pages/recursion-schemes.md > src/Pages/RecursionSchemes.elm
pandoc -t build/pandoc-build-page-from-markdown.lua pages/functional-linear-algebra.md > src/Pages/FunctionalLinearAlgebra.elm
pandoc -t build/pandoc-build-page-from-markdown.lua pages/functional-linear-algebra-with-types.md > src/Pages/FunctionalLinearAlgebraWithTypes.elm
pandoc -t build/pandoc-build-page-from-markdown.lua pages/functional-linear-algebra-memoized.md > src/Pages/FunctionalLinearAlgebraMemoized.elm
pandoc -t build/pandoc-build-page-from-markdown.lua pages/diy-pattern-matching.md > src/Pages/DiyPatternMatching.elm