//This file is used when requiring angular from the nodejs
// we'll need to load angular's source, modify it a bit
// and run it on artificial `window` and `document` created with `jsdom`

'use strict';

const window = require('./window'),
  envFlag = require('node-env-flag'),
  debug = require('debug')('node-angular');

const paths = {
  jquery: process.env.TP_JQUERY_PATH,
  angular: process.env.TP_ANGULAR_PATH,
  ngMocks: process.env.TP_ANGULAR_MOCKS_PATH,
  ngSanitize: process.env.TP_ANGULAR_SANITIZE_PATH,
  jasmineJquery: process.env.TP_JASMINE_JQUERY_PATH
};


Object.keys(paths).forEach((name) => {
  debug(`loading ${name} from ${paths[name]}`);
});


if (!paths.angular) {
  throw new Error('TP_ANGULAR_PATH must specify the path to the angular.js file');
}

const prevGlobal = {},
  globalKeys = ['window', 'document', 'navigator'];

// save the state of global before we start changing it
globalKeys.forEach((key) => {
  prevGlobal[key] = global[key];
});

global.window = window;
global.document = window.document;
global.navigator = window.navigator;

// needed because angular is referenced as angular instead of window.angular
global.angular = {
  $$csp: function() {
    return window.angular.$$csp.apply(window.angular, arguments);
  },
  element: function() {
    return window.angular.element.apply(window.angular, arguments);
  }
};

// angular-mocks checks for `window.jasmine`, otherwise it won't define `angular.mock.module`
// we test for `beforeEach` to check if we run under jasmine
if (global.jasmine) {
  window.jasmine = global.jasmine;
  window.beforeEach = global.beforeEach;
  window.afterEach = global.afterEach;
}

// jQuery will not expose on `window` so we have to do it ourselves.
// Has to be loaded before angular so `angular.element` will use jQuery
if (paths.jquery) {
  window.jQuery = window.$ = require(paths.jquery);
}

require(paths.angular);

if (paths.ngMocks) {
  require(paths.ngMocks);
}

if (paths.ngSanitize) {
  require(paths.ngSanitize);
}

// if we are testing, extend jasmine with jasmine-jquery
if (global.jasmine && paths.jasmineJquery) {
  require(paths.jasmineJquery);
}

// restore of global
globalKeys.forEach((key) => {
  global[key] = prevGlobal[key];
});

module.exports = global.angular = window.angular;
