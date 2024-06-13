I've got pandoc working so we can generate the basic structure needed for our pages!

```
pandoc -t build/pandoc-build-page-from-markdown.lua -M title="RecursionSchemes" media/markdown/recursion-schemes.md
```

Using pandoc we can pass arguments to the lua command, e.g. representing the title of the page

Target format:

- Starts with an h1 header.
- No other h1s in the code
- Code blocks annotated with "sitecode" should contain elm code that should be interpreted literally, not wrapped in strings or anything
- IF there is an initial SITECODE block before the h1 header, this is expected to include imports and other code that exists outside the main page
- Links???


elm-live --pushstate -p 8001 src/Main.elm                                                


pandoc --resource-path=pages/the-guts-of-git --extract-media=media -t build/pandoc-build-page-from-markdown.lua -M title="RecursionSchemes" pages/the-guts-of-git/the-guts-of-git.md

use the flag `-M dynamic` to generate a page that renders differently depending on what model is present. only really makes sense when using embedded sitecode

we can put stuff in the yaml metadata to keep track of these metadata options without having to enter them manually. pretty teriffic

pandoc -t native pages/the-guts-of-git/the-guts-of-git.md


date in format YYYY-MM-DD


need data on

- url
- module name
- page title (for navigation main page)

should these be logical transformations of each other? perhaps we presume the page title is the main thing, then we make it camel case for the module name and dash separated for the url. so then should this be derived from the page title in the markdown? but then we might have link instability. so we have a couple of competing needs. we want URLs to remain stable. we want titles to be editable. we probably want module names to be stable too. this suggests to me that we want the title to be one thing and then we want a formula for page references as another thing

i really really want to keep urls stable. perhaps i should create a specific URL tracking file. keeping URLs separate could make it easier to ensure that URL modifications are append-only. what do we need urls for? deciding which update and view to use, right?

what in particular do i want to preserve with URLs? that should make the decision on how to use them easier.

part of the thing is i also want the urls to be available all in one place, so i can quickly verify which ones are in use and which are free


elm-live -d site/ --pushstate -p 8001 src/Main.elm -- --output=site/elm.js