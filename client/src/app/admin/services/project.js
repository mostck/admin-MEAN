(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminProjectService', adminProjectService);

  adminProjectService.$inject = ['$http', 'configService'];

  function adminProjectService($http, configService) {

    var getAllProjects = function () {
      return $http.get(configService.getApiUri + '/projects')
        .then(function (response) {
          return response.data;
        });
    };

    var getAllProjectsCustomer = function (id) {
      return $http.get(configService.getApiUri + '/projectsCustomer/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var getAllProjectsSupplier = function (id) {
      return $http.get(configService.getApiUri + '/projectsSupplier/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var get = function (id) {
      return $http.get(configService.getApiUri + '/project?id=' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var create = function (project) {
      return $http.post(configService.getApiUri + '/project', project)
        .then(function (response) {
          return response.data;
        });
    };

    var confirm = function (id) {
      return $http.post(configService.getApiUri + '/projectConfirm', { 'id': id })
        .then(function (response) {
          return response.data;
        });
    };

    var prolong = function (project) {
      return $http.post(configService.getApiUri + '/projectProlong', { 'project': project })
        .then(function (response) {
          return response.data;
        });
    };

    var update = function (project) {
      return $http.put(configService.getApiUri + '/project', project)
        .then(function (response) {
          return response.data;
        });
    };

    var remove = function (id) {
      return $http.delete(configService.getApiUri + '/project/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    return {
      getAllProjects: getAllProjects,
      getAllProjectsCustomer: getAllProjectsCustomer,
      getAllProjectsSupplier: getAllProjectsSupplier,
      get: get,
      create: create,
      prolong: prolong,
      confirm: confirm,
      update: update,
      remove: remove
    };
  }
})();