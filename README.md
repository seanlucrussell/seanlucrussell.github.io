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


elm-live src/Main.elm --host=10.0.0.119 --port=8001 --dir=docs/ --pushstate --start-page=index.html -- --output=docs/elm.js


analytics are something to think about sometime. how would you wanna do that? roll your own? use off the shelf? idk.


## pre-flight

- [x] fix mobile scaling
- [x] write bio
- [x] better contact system
- [ ] what do i do with local build?
- [x] beautify navigation / home page
- [ ] scan through pages, make sure there are not glaring errors
- [x] rectify dates
- [ ] confirm initial urls (develop scheme?)
- [x] adopt my domain name

## defense of design

### Pandoc integration



### Model and message architecture

I've opted for a very flat application architecture. There is one core message type and one core model type. We don't specialize either of these for articles or have nested data structures. While this does prevent encapsulation of application components, I'm finding that encapsulation is overrated. Especially for a project of this size. A few core datatypes with a million operations defined on them is way better than a million datatypes with a few operations each. This also reduces plumbing since we don't gotta isolate substructures to pass to other handlers. I'm somewhat inspired by the co-dfns project because their compiler passes seem to work in sorta the same way.

This also provides potential flexibility for fun things in the future. We could have pages secretly influencing other pages in the background, which would allow for all sorts of weirdness. We could allow for a page to influence the global model or easily emit messages to the global update handler.

### URL routing

Our url system took a bit of work to figure out. I'm still not sure it is as elegant as it could be, but it's pretty good.

The central problem is that I want URLs to be stable in time. If a URL gets added to the website and someone links to it from somewhere, I'd like to ensure that the link never disappears. However I'd also like to preserve the ability to flexibly change and add links.

What I've settled on is a simple system. We have the UrlMap funciton in our sitewide group of documents. This acts as a routing system for the site. I can pretty easily ensure manually that routes are never removed or changed, just added. I can also quickly see all the current routes in the system.

In addition each individual article generates some metadata that includes the primary URL for a given article. this URL can then be the single source of truth for the rest of the site when the site needs to look up pages.

So we divide the URL handling into two parts: the routing and the usage. this does create an opportunity for the two to get out of sync, but so long as the routing is append-only we can't *break* existing pages if we mess up the primary URL. changing the primary URL for a page will only affect that page, so we don't have a ton of testing to do when making changes there. and since we do keep track of the primary URL, there is only one place that the two can get desynchronized.

I suspect there are cleverer ways to implement this system, but I'm attracted to the simplicity of this basic implementation. Importantly it is good enough for now, so we will leave it be.

