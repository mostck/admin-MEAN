(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('localeService', localeService);

  localeService.$inject = ['$rootScope', 'configService', '$translate', 'localStorageService'];

  function localeService($rootScope, configService, $translate, localStorageService) {

    var getCurrent = function () {
      return localStorageService.get('locale') || configService.defaultLocale;
    };

    var apply = function (value) {
      const locale = value.toLowerCase();

      $translate.use(locale);
      moment.locale(locale);
    };

    return {
      init: function () {
        apply(getCurrent());
      },
      set: function (value) {
        if (value !== getCurrent()) {
          localStorageService.set('locale', value);
          apply(value);
        }
      },
      get: function () {
        return getCurrent();
      }
    };
  }
})();