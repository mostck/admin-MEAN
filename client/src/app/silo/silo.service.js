(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('SiloService', SiloService);

  SiloService.$inject = ['$http', 'configService'];

  function SiloService($http, configService) {
    var sendReminder = function (silo, percent, estimateDate) {
      return $http.post(configService.getApiUri + '/siloReminder', {
        id: silo._id,
        percent: percent,
        estimateDate: estimateDate
      })
        .then(function (response) {
          return response.data;
        });
    };

    var changeFillingLevel = function (silo) {
      return $http.post(configService.getApiUri + '/siloFillingLevel', {
        id: silo._id,
        fillingLevel: silo.fillingLevel
      })
        .then(function (response) {
          return response.data;
        });
    };

    return {
      sendReminder: sendReminder,
      changeFillingLevel: changeFillingLevel
    };
  }

})();