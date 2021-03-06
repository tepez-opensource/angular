// This file exports the artificial window used by angular
// That way, we can get by require('angular/window') and load other libraries, e.g. jQuery,
// on it.

'use strict';

const jsdom = require('jsdom'),
    document = jsdom.jsdom('<html><head></head><body></body></html>');


module.exports = document.defaultView;
