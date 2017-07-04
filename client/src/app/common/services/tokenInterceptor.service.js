(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('TokenInterceptor', TokenInterceptor);

  TokenInterceptor.$inject = ['$q', '$cookies', 'localeService', '$injector'];

  function TokenInterceptor($q, $cookies, localeService, $injector) {
    return {
      request: function (config) {
        config.headers = config.headers || {};

        if ($cookies.get("token")) {
          config.headers.Authorization = 'Bearer ' + $cookies.get("token");
          config.headers['Accept-Language'] = localeService.get();
        }
        return config;
      },

      requestError: function(rejection) {
        return $q.reject(rejection);
      },

      response: function (response) {
        return response || $q.when(response);
      },

      responseError: function(rejection) {
        if (rejection !== null && rejection.status === 401 && ($cookies.get('token'))) {
          var state = $injector.get('$state');
          var userService = $injector.get('userService');
          userService.logout();
          state.go('login');
        }

        return $q.reject(rejection);
      }
    };
  }
})();