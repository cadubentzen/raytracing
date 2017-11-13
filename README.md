# Raytracing in WebGL

[![Build Status](https://travis-ci.org/cadubentzen/raytracing.svg?branch=master)](https://travis-ci.org/cadubentzen/raytracing)

This is the final project of the Computer Graphics discipline at UFRN.

It consists of a Ray Tracing implementation in WebGL. [Click here to see our demo](https://cadubentzen.github.io/raytracing).

#### Browser requirements:
- Chrome >= 50
- Edge >= 13
- Firefox >= 45
- Opera >= 37
- Safari >= 10

### Repository Structure

The repository branches are configured as follows:

* **master**: stable code. This branch is blocked for direct commits, so all commits must be reviewed through pull requests. Develop your code in a feature branch and make a pull request here for code review. To see more about that, check this tutorial about [code review](https://about.gitlab.com/2017/03/17/demo-mastering-code-review-with-gitlab/)

* **gh-pages**: this is where the demo is hosted. GitHub pages is configured to get the demo from there. To update the demo, merge stable code from master into gh-pages branch.

### Getting Started

#### Opening page locally:

Simply clone this repo and open `index.html` in your browser.

#### Requirements for developing:
- NodeJS >= 6 and NPM

To get started, once you clone this repository, run `npm install`.

### Coding style

As all modern browsers nowadays support [ES6](https://github.com/lukehoban/es6features), we will be using its features such as:
- [Classes](https://github.com/lukehoban/es6features#classes)
- [Arrow functions](https://github.com/lukehoban/es6features#arrows)
- [Promises](https://github.com/lukehoban/es6features#promises)
- [Template strings](https://github.com/lukehoban/es6features#template-strings)

We use [Airbnb coding style](https://github.com/airbnb/javascript) for Javascript. There is a [Travis CI](http://travis-ci.org/) bot checking code style, so if your code does not pass style checking, you will have to fix it.

To do so, or even before comitting, run `npm run lint` and check the output for the points where you need to change. This will ensure your code will pass Travis CI testing.

### Wiki

This repository contains a [wiki](https://github.com/cadubentzen/raytracing/wiki), which contains useful information about WebGL and links to tutorials about Ray tracing.

### Future plans

Upon successful implementation in WebGL, we plan on implementing the algorithm in C++ and porting to run on the browser using [WebAssembly](http://webassembly.org).
