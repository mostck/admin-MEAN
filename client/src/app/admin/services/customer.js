(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminCustomerService', adminCustomerService);

  adminCustomerService.$inject = ['$http', 'configService'];

  function adminCustomerService($http, configService) {

    var getAllCustomers = function () {
      return $http.get(configService.getApiUri + '/customers')
        .then(function (response) {
          return response.data;
        });
    };

    var getCustomer = function (id) {
      return $http.get(configService.getApiUri + '/customer?id=' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var createCustomer = function (customer) {
      return $http.post(configService.getApiUri + '/customer', customer)
        .then(function (response) {
          return response.data;
        });
    };

    var updateCustomer = function (customer) {
      return $http.put(configService.getApiUri + '/customer', customer)
        .then(function (response) {
          return response.data;
        });
    };

    var removeCustomer = function (id) {
      return $http.delete(configService.getApiUri + '/customer/' + id)
        .then(function (response) {
          return response.data;
        });
    };
    return {
      getAllCustomers: getAllCustomers,
      getCustomer: getCustomer,
      createCustomer: createCustomer,
      updateCustomer: updateCustomer,
      removeCustomer: removeCustomer
    };
  }
})();