(() => {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('cruRequest', cruRequest);

  cruRequest.$inject = ['$http', 'configService', 'Toast'];

  /* @ngInject */
  function cruRequest($http, configService, Toast) {
    const service = {
      getAll        : getAll,
      getAllForDevice: getAllForDevice,
      get           : get,
      create        : create,
      update        : update
    };
    return service;
    ////////////////
    function getAll() {
      return $http.get(configService.getApiUri + '/crus')
        .then(res => res.data, errorHandler);
    }

    function getAllForDevice(id) {
      return $http.get(configService.getApiUri + '/crusForDevice/' + id)
        .then(res => res.data, errorHandler);
    }

    function get(id) {
      return $http.get(configService.getApiUri + '/cru?id=' + id)
        .then(res => res.data, errorHandler);
    }

    function create(record) {
      return $http.post(configService.getApiUri + '/cru', record)
        .then(res => res.data, errorHandler);
    }

    function update(record) {
      return $http.put(configService.getApiUri + '/cru', record)
        .then(res => res.data, errorHandler);
    }

    function errorHandler(err) {
      if (err.status === 500) {
        Toast.show({
          type    : 'error',
          content : err.message
        });
      }
    }
  }
})();