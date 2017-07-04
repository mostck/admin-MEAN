(() => {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('adminOrderService', adminOrderService);

  adminOrderService.$inject = ['$http', 'configService', 'Toast'];

  /* @ngInject */
  function adminOrderService($http, configService, Toast) {
    const service = {
      getAll        : getAll,
      getAllSupplier: getAllSupplier,
      get           : get,
      create        : create,
      update        : update,
      remove        : remove
    };
    return service;
    ////////////////
    function getAll() {
      return $http.get(configService.getApiUri + '/orders')
        .then(res => res.data, errorHandler);
    }

    function getAllSupplier(id) {
      return $http.get(configService.getApiUri + '/ordersSupplier/' + id)
        .then(res => res.data, errorHandler);
    }

    function get(id) {
      return $http.get(configService.getApiUri + '/order?id=' + id)
        .then(res => res.data);
    }

    function create(order) {
      return $http.post(configService.getApiUri + '/order', order)
        .then(res => res.data, errorHandler);
    }

    function update(order) {
      return $http.put(configService.getApiUri + '/order', order)
        .then(res => res.data, errorHandler);
    }

    function remove(id) {
      return $http.delete(configService.getApiUri + '/order/' + id)
        .then(res => res.data, errorHandler);
    }

    function errorHandler(err) {
      return err;
      // if (err.status === 500) {
      //   Toast.show({
      //     type    : 'error',
      //     content : err.message
      //   });
      // }
    }
  }
})();