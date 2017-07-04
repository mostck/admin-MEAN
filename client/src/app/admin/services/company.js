(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminCompanyService', adminCompanyService);

  adminCompanyService.$inject = ['$http', 'configService'];

  function adminCompanyService($http, configService) {

    var getAllCompanies = function () {
      return $http.get(configService.getApiUri + '/companies')
        .then(function(response) {
          return response.data;
        });
    };

    var getCompany = function (id) {
      return $http.get(configService.getApiUri + '/company')
        .then(function (response) {
          return response.data;
        });
    };

    var createCompany = function (company) {
      return $http.post(configService.getApiUri +'/company', company)
        .then(function(response) {
          return response.data;
        });
    };

    var updateCompany = function (company) {
      return $http.put(configService.getApiUri + '/company', company)
        .then(function (response) {
          return response.data;
        });
    };

    var removeCompany = function (id) {
      return $http.delete(configService.getApiUri + '/company/' + id)
        .then(function (response) {
          return response.data;
        });
    };
    return {
      getAllCompanies: getAllCompanies,
      getCompany: getCompany,
      createCompany: createCompany,
      updateCompany: updateCompany,
      removeCompany: removeCompany
    };
  }
})();