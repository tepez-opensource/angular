angular for node
================

[![Build Status](https://travis-ci.org/tepez/angular.svg?branch=master)](https://travis-ci.org/tepez/angular)


Inspired by bclinkinbeard's [angular](https://github.com/bclinkinbeard/angular) with a lot of changes for a private use case:

* Different entry point for browserify that exports the already loaded angular (from `window.angular`).

* We `require` the angular source instead of evaling it, to have meaningful stack traces.

* We load several more modules: jquery, angular-mocks, angular-sanitize and jasmine-jquery. jasmine-jquery is loaded only when testing, i.e. when the `global.jasmine` is defined.
 
* For each module, we have an env variable that determines the location from which its loaded. The module is only loaded if the env variable is defined:


    TP_JQUERY_PATH
    TP_ANGULAR_PATH
    TP_ANGULAR_MOCKS_PATH
    TP_ANGULAR_SANITIZE_PATH
    TP_JASMINE_JQUERY_PATH
  
* We use env variable `TP_VERBOSE` as a flag to control the printing of verbose log messages with the locations of the loaded scripts.

* We use `mocha`/`chai` for testing instead of `tape`.

* We use bower to get angular (but only for testing) instead of a custom script. 

### Run tests

    npm install
    bower install

    npm test
    
    # for debugging
    npm run-script test_debug


### Example - how to mock $q with q

    angular = require('angular');
    q = require('q');
    
    angular.module('ng').config([
      '$provide', function($provide) {
        return $provide.decorator('$q', function() {
          return q;
        });
      }
    ]);
