(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminStatisticsService', adminStatisticsService);

  adminStatisticsService.$inject = ['$http', 'configService'];

  function adminStatisticsService($http, configService) {

    var getByProject = function () {
      return $http.get(configService.getApiUri + '/statisticsByProject')
        .then(function (response) {
          return response.data;
        });
    };

    var getBySupplier = function (startDate, endDate) {
      return $http.get(configService.getApiUri + '/statisticsBySupplier' + '?startDate=' + moment(startDate).format('YYYY-MM-DD') + '&endDate=' + moment(endDate).format('YYYY-MM-DD'))
        .then(function (response) {
          return response.data;
        });
    };

    return {
      getByProject: getByProject,
      getBySupplier: getBySupplier
    };
  }
})();