I've got pandoc working so we can generate the basic structure needed for our pages!

```
pandoc -t build/pandoc-build-page-from-markdown.lua -M title="RecursionSchemes" media/markdown/recursion-schemes.md
```

Using pandoc we can pass arguments to the lua command, e.g. representing the title of the page

Target format:

- Starts with an h1 header.
- No other h1s in the code
- Code blocks annotated with "SITECODE" should contain elm code that should be interpreted literally, not wrapped in strings or anything
- IF there is an initial SITECODE block before the h1 header, this is expected to include imports and other code that exists outside the main page
- Links???


elm-live --pushstate -p 8001 src/Main.elm                                                


pandoc --resource-path=pages/the-guts-of-git --extract-media=media -t build/pandoc-build-page-from-markdown.lua -M title="RecursionSchemes" pages/the-guts-of-git/the-guts-of-git.md



pandoc -t native pages/the-guts-of-git/the-guts-of-git.md