(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('translateLoader', translateLoader);

  /* @ngInject */
  function translateLoader($rootScope, $q, $timeout, $translateStaticFilesLoader) {
    var loader = $translateStaticFilesLoader;

    return function (options) {
      var deferred = $q.defer();

      loader(options)
        .then(deferred.resolve, deferred.reject)
        .then(() => $rootScope.loading = false);

      return deferred.promise;
    };
  }
})();
