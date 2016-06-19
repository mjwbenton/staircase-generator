# Staircase

A static website generator that has just the features I needed for [mattbenton.co.uk](https://mattbenton.co.uk).

## Status & Purpose

I've used this little project as a way to learn about a few different technologies, and get rid of an old website generator I had that I no longer wanted to maintain. I'm not expecting anyone to use this, and so I haven't published it to NPM at this time, nor have I put a large amount of thought into making; the design works well for what I needed, but probably doesn't extend to all the feature's you'd expect from a static website generator.

## Features

* Process content files written in markdown, with yaml metadata.
* Generate website navigation based upon yaml metadata.
* Support React components as templates.
* Fetch photo sets from [Flickr](https://flickr.com).

## Technical Details

* Written in Javascript.
* Written with [Flow](https://flowtype.org/) annotations.
* All new steps are just functions that take a site object and return a new site object.
