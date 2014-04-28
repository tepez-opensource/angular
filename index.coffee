# This file is used when requiring angular from the nodejs
# we'll need to load angular's source, modify it a bit
# and run it on artificial `window` and `document` created with `jsdom`

fs = require('fs')
jsdom = require('jsdom')
xmlhttprequest = require('xmlhttprequest')
q = require('q')

document = jsdom.jsdom('<html><head></head><body></body></html>')
window = document.parentWindow
window.XMLHttpRequest = xmlhttprequest

prevWindow = global.window
prevDocument = global.document
prevNavigator = global.navigator
prevAngular = global.angular

global.window = window
global.document = document
global.navigator = window.navigator

# needed because angular is referenced as angular instead of window.angular
global.angular = {
  $$csp : () -> window.angular.$$csp.apply(window.angular, arguments)
  element : () -> window.angular.element.apply(window.angular, arguments)
}

# angular-mocks checks for `window.jasmine`, otherwise it won't define `angular.mock.module`
# we test for `beforeEach` to check if we run under jasmine
if global.jasmine?
  window.jasmine = true

require('../../../client/vendor/angular/angular.js')
require('../../../client/vendor/angular-mocks/angular-mocks.js')
require('../../../client/vendor/angular-sanitize/angular-sanitize.js')

global.window = prevWindow
global.document = prevDocument
global.navigator = prevNavigator

# modify angular's $q to use kriskowal's q
window.angular.module('ng').config(['$provide', ($provide) ->
  $provide.decorator('$q', ['$delegate', ($delegate) ->
    return q
  ])
])

module.exports = global.angular = window.angular

