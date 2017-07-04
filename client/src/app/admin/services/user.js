(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminUserService', adminUserService);

  adminUserService.$inject = ['$http', 'configService'];

  function adminUserService($http, configService) {

    var getAllUsers = function () {
      return $http.get(configService.getApiUri + '/users')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllSuppliers = function () {
      return $http.get(configService.getApiUri + '/supplierUsers')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllEmployees = function () {
      return $http.get(configService.getApiUri + '/employeeUsers')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllPms = function () {
      return $http.get(configService.getApiUri + '/pmUsers')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllPmsAdmin = function () {
      return $http.get(configService.getApiUri + '/pmAdminUsers')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllPmsCustomer = function (id) {
      return $http.get(configService.getApiUri + '/pmCustomerUsers/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var getAllAdminUsers = function () {
      return $http.get(configService.getApiUri + '/adminUsers')
        .then(function (response) {
          return response.data;
        });
    };

    var getUser = function (id) {
      return $http.get(configService.getApiUri + '/user?id=' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var createUser = function (user) {
      return $http.post(configService.getApiUri + '/user', user)
        .then(function (response) {
          return response.data;
        });
    };

    var updateUser = function (user) {
      return $http.put(configService.getApiUri + '/user', user)
        .then(function (response) {
          return response.data;
        });
    };

    var removeUser = function (id) {
      return $http.delete(configService.getApiUri + '/user/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    return {
      getAllUsers: getAllUsers,
      getAllEmployees: getAllEmployees,
      getAllSuppliers: getAllSuppliers,
      getAllPms: getAllPms,
      getAllPmsAdmin: getAllPmsAdmin,
      getAllPmsCustomer: getAllPmsCustomer,
      getAllAdminUsers: getAllAdminUsers,
      getUser: getUser,
      createUser: createUser,
      updateUser: updateUser,
      removeUser: removeUser
    };
  }
})();