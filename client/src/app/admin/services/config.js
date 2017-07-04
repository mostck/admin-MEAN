(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminConfigService', adminConfigService);

  adminConfigService.$inject = ['$http', 'configService'];

  function adminConfigService($http, configService) {

    var getConfig = function () {
      return $http.get(configService.getApiUri + '/config')
        .then(function (response) {
          return response.data;
        });
    };

    var updateConfig = function (config) {
      return $http.put(configService.getApiUri + '/config', config)
        .then(function (response) {
          return response.data;
        });
    };

    // var createConfig = function (config) {
    //   return $http.post(configService.getApiUri + '/config', config)
    //     .then(function (response) {
    //       return response.data;
    //     });
    // };

    return {
      getConfig: getConfig,
      updateConfig: updateConfig
      // createConfig: createConfig
    };
  }
})();
