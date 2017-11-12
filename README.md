# Raytracing

This is the final project of the Computer Graphics discipline at UFRN.

It consists of a Ray Tracing implementation in WebGL. [Click here to see your demo](https://cadubentzen.github.io/raytracing).

### Repository Structure

The repository branches are configured as follows:

* **master**: stable code. This branch is blocked for directfb, so all commits must be through pull requests. Develop your code in a feature branch and make a pull request here for code review. To see more about that, check this tutorial about [code review](https://about.gitlab.com/2017/03/17/demo-mastering-code-review-with-gitlab/)

* **gh-pages**: this is where the demo is hosted. GitHub pages is configured to get the demo from there. To update the demo, merge stable code from master into gh-pages branch.

### Wiki

This repository contains a [wiki](https://github.com/cadubentzen/raytracing/wiki), which contains useful information about WebGL and links to tutorials about Ray tracing.

### Future plans

Upon successful implementation in WebGL, we plan on implementing the algorithm in C++ and porting to run on the browser using [WebAssembly](http://webassembly.org).
