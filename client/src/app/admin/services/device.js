(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminDeviceService', adminDeviceService);

  adminDeviceService.$inject = ['$http', '$q', 'configService', 'Silo', 'Heater'];

  function adminDeviceService($http, $q, configService, Silo, Heater) {
    // - start heater data collection

    var getHeaterDataCollection = function () {
      return $http.get(configService.getApiUri + '/heater/status')
        .then(function (response) {
          return response.data;
        });
    };

    var deleteAllHeaterDataCollection = function () {
      return $http.delete(configService.getApiUri + '/heaters/status');
    };

    // - end heater data collection

    var getAllHeaters = function () {
      return $http.get(configService.getApiUri + '/heaters')
        .then(function (response) {
          return response.data.map(function (heater) {
            return new Heater(heater);
          });
        });
    };

    var getHeater = function (id) {
      return $http.get(configService.getApiUri + '/heater?id=' + id)
        .then(function (response) {
          return new Heater(response.data);
        });
    };

    var createHeater = function (heater) {
      return $http.post(configService.getApiUri + '/heater', heater)
        .then(function (response) {
          return response.data;
        });
    };

    var updateHeater = function (heater) {
      return $http.put(configService.getApiUri + '/heater', heater)
        .then(function (response) {
          return response.data;
        });
    };

    var removeHeater = function (id) {
      return $http.delete(configService.getApiUri + '/heater/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    var getAllSilos = function () {
      return $http.get(configService.getApiUri + '/silos')
        .then(function (response) {
          return response.data.map(function (silo) {
            return new Silo(silo);
          });
        });
    };

    var getAllCurrentSilos = function () {
      return $http.get(configService.getApiUri + '/silosCurrent')
        .then(function (response) {
          // return response.data.map(function (silo) {
          //   return new Silo(silo);
          // });
          return response.data.map(function (silo) {
            return new Silo(silo);
          });
        });
    };

    var getAll = function () {
      return $q.all({
        heaters: getAllHeaters(),
        silos: getAllSilos()
      }).then(function (data) {
        return data.heaters.concat(data.silos);
      });
    };

    var getSilo = function (id) {
      return $http.get(configService.getApiUri + '/silo?id=' + id)
        .then(function (response) {
          return new Silo(response.data);
        });
    };

    var createSilo = function (silo) {
      return $http.post(configService.getApiUri + '/silo', silo)
        .then(function (response) {
          return response.data;
        });
    };

    var updateSilo = function (silo) {
      return $http.put(configService.getApiUri + '/silo', silo)
        .then(function (response) {
          return response.data;
        });
    };

    var removeSilo = function (id) {
      return $http.delete(configService.getApiUri + '/silo/' + id)
        .then(function (response) {
          return response.data;
        });
    };

    return {
      getAll: getAll,
      deleteAllHeaterDataCollection: deleteAllHeaterDataCollection,
      getHeaterDataCollection: getHeaterDataCollection,
      getAllHeaters: getAllHeaters,
      getHeater: getHeater,
      createHeater: createHeater,
      updateHeater: updateHeater,
      removeHeater: removeHeater,
      getAllSilos: getAllSilos,
      getAllCurrentSilos: getAllCurrentSilos,
      getSilo: getSilo,
      createSilo: createSilo,
      updateSilo: updateSilo,
      removeSilo: removeSilo
    };
  }
})();