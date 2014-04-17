# This file is used when requiring angular from the nodejs
# we'll need to load angular's source, modify it a bit
# and run it on artificial `window` and `document` created with `jsdom`

fs = require('fs')
jsdom = require('jsdom')

document = jsdom.jsdom('<html><head></head><body></body></html>')
window = document.parentWindow

(() ->

  # read angular source into memory
  # we use the same angularjs as the client uses
  src = require("fs").readFileSync(__dirname + "/../../client/vendor/angular/angular.min.js", "utf8")

  # replace implicit references
  src = src.replace("angular.element(document)", "window.angular.element(document)")
  src = src.split("(navigator.userAgent)").join("(window.navigator.userAgent)")
  src = src.split("angular.$$csp").join("window.angular.$$csp")

  (new Function("window", "document", src))(window, document)


  # angular-mock won't define `angular.mock.module` otherwise
  window.jasmine = true

  beforeEach = afterEach = (x) -> x

  src = require("fs").readFileSync(__dirname + "/../../client/vendor/angular-mocks/angular-mocks.js", "utf8")

  # we eval so the code could see the nopes beforeEach and afterEach we defined
  eval(src)


)()

module.exports = window.angular
