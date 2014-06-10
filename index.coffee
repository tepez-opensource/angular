# This file is used when requiring angular from the nodejs
# we'll need to load angular's source, modify it a bit
# and run it on artificial `window` and `document` created with `jsdom`

q = require('q')
window = require('./window')


prevWindow = global.window
prevDocument = global.document
prevNavigator = global.navigator
prevAngular = global.angular

global.window = window
global.document = window.document
global.navigator = window.navigator

# needed because angular is referenced as angular instead of window.angular
global.angular = {
  $$csp : () -> window.angular.$$csp.apply(window.angular, arguments)
  element : () -> window.angular.element.apply(window.angular, arguments)
}

# angular-mocks checks for `window.jasmine`, otherwise it won't define `angular.mock.module`
# we test for `beforeEach` to check if we run under jasmine
if global.jasmine?
  window.jasmine = global.jasmine
  window.beforeEach = global.beforeEach
  window.afterEach = global.afterEach

# jQuery will not expose on `window` so we have to do it ourself.
# Has to be loaded before angular so `angular.element` will use jQuery
if process.env.TP_JQUERY_PATH
  jQuery = require(process.env.TP_JQUERY_PATH)
  window.jQuery = window.$ = jQuery

require(process.env.TP_ANGULAR_PATH)

if process.env.TP_ANGULAR_MOCKS_PATH
  require(process.env.TP_ANGULAR_MOCKS_PATH)

if process.env.TP_ANGULAR_SANITIZE_PATH
  require(process.env.TP_ANGULAR_SANITIZE_PATH)

# if we are testing, extend jasmine with jasmine-jquery
if global.jasmine? and process.env.TP_JASMINE_JQUERY_PATH
  require(process.env.TP_JASMINE_JQUERY_PATH)

global.window = prevWindow
global.document = prevDocument
global.navigator = prevNavigator

# modify angular's $q to use kriskowal's q
window.angular.module('ng').config(['$provide', ($provide) ->
  $provide.decorator('$q', () -> return q)
])

module.exports = global.angular = window.angular
