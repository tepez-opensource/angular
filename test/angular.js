const expect = require('chai').expect,
  path = require('path');


describe('angular', () => {

  let spec;

  function scriptPath(script) {
    return path.join(__dirname, '..', 'bower_components', script);
  }

  function loadModules() {
    [
      '..',
      '../window',
      scriptPath('jquery/dist/jquery.js'),
      scriptPath('angular/angular.js'),
      scriptPath('angular-mocks/angular-mocks.js'),
      scriptPath('angular-sanitize/angular-sanitize.js'),
      scriptPath('jasmine-jquery/lib/jasmine-jquery.js')
    ].forEach((script) => {
      delete require.cache[require.resolve(script)];
    });
    spec.angular = require('..');
    spec.window = require('../window');
  }

  beforeEach(function () {
    spec = this;
  });

  beforeEach(() => {
    process.env.TP_JQUERY_PATH = scriptPath('jquery/dist/jquery.js');
    process.env.TP_ANGULAR_PATH = scriptPath('angular/angular.js');
    process.env.TP_ANGULAR_MOCKS_PATH = scriptPath('angular-mocks/angular-mocks.js');
    process.env.TP_ANGULAR_SANITIZE_PATH = scriptPath('angular-sanitize/angular-sanitize.js');
    process.env.TP_JASMINE_JQUERY_PATH = scriptPath('jasmine-jquery/lib/jasmine-jquery.js');
  });

  describe('when global.jasmine is not defined', () => {
    beforeEach(loadModules);

    it('angular should work', () => {
      spec.angular.injector(['ng']).invoke(($rootScope, $compile) => {
        var el = spec.angular.element('<div>{{ 2 + 2 }}</div>');
        el = $compile(el)($rootScope);
        $rootScope.$digest();
        expect('' + el.html()).to.equal('4')
      });
    });

    it('angular should be able to sanitize html', () => {
      angular.injector(['ng', 'ngSanitize']).invoke(($sce) => {
        expect($sce.getTrustedHtml('xxx<script>yyy</script>zzz')).to.equal('xxxzzz');
      });
    });

    it('window.angular should be angular', () => {
      expect(spec.window.angular.version).to.be.an('object');
    });

    it('window.$ and window.jQuery should be jQuery', () => {
      expect(spec.window.$).to.equal(spec.window.jQuery);
      expect(spec.window.$.fn.jquery).to.be.a('string');
    });
  });

  describe('when global.jasmine is defined', () => {
    beforeEach(() => {
      global.jasmine = {};
      // we must change the global beforeEach and afterEach because angular-mocks
      // calls them and this interferes we our mocha tests
      spec._beforeEach = beforeEach;
      spec._afterEach = afterEach;
      global.beforeEach = function() {};
      global.afterEach = function() {};
      loadModules();
    });

    afterEach(() => {
      global.beforeEach = spec._beforeEach;
      global.afterEach = spec._afterEach;
      delete global.jasmine;
    });

    it('angular be able to mock module', () => {
      expect(spec.angular.mock.module).to.be.a('Function');
    });

    it('window should have jasmine, beforeEach and afterEach', () => {
      expect(spec.window.jasmine).to.equal(global.jasmine);
      expect(spec.window.beforeEach).to.equal(global.beforeEach);
      expect(spec.window.afterEach).to.equal(global.afterEach);
    });

    it('jasmine-jquery should have been loaded', () => {
      expect(spec.window.jasmine.jQuery).to.be.an('Function');
    });
  });
});
