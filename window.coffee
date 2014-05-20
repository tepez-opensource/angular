# This file exports the artificial window used by angular
# That way, we can get by require('angular/window') and load other libraries, e.g. jQuery,
# on it.

jsdom = require('jsdom')

document = jsdom.jsdom('<html><head></head><body></body></html>')
window = document.parentWindow

module.exports = window