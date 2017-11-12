# Raytracing in WebGL

This is the final project of the Computer Graphics discipline at UFRN.

It consists of a Ray Tracing implementation in WebGL. [Click here to see our demo](https://cadubentzen.github.io/raytracing).

Browser requirements:
- Chrome >= 50
- Edge >= 13
- Firefox >= 45
- Opera >= 37
- Safari >= 10

### Repository Structure

The repository branches are configured as follows:

* **master**: stable code. This branch is blocked for directfb, so all commits must be through pull requests. Develop your code in a feature branch and make a pull request here for code review. To see more about that, check this tutorial about [code review](https://about.gitlab.com/2017/03/17/demo-mastering-code-review-with-gitlab/)

* **gh-pages**: this is where the demo is hosted. GitHub pages is configured to get the demo from there. To update the demo, merge stable code from master into gh-pages branch.

### Coding style

As all modern browsers nowadays support [ES6](https://github.com/lukehoban/es6features), we will be using its features such as Classes, Arrow functions and Promises.

We will be using [Airbnb coding style](https://github.com/airbnb/javascript) for Javascript. **TODO:** Travis CI automated checking.

### Wiki

This repository contains a [wiki](https://github.com/cadubentzen/raytracing/wiki), which contains useful information about WebGL and links to tutorials about Ray tracing.

### Future plans

Upon successful implementation in WebGL, we plan on implementing the algorithm in C++ and porting to run on the browser using [WebAssembly](http://webassembly.org).
