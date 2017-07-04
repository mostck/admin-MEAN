(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('adminLogsService', adminLogsService);

  adminLogsService.$inject = ['$http', 'configService'];

  function adminLogsService($http, configService) {
    var getLogs = function (startDate, endDate, type) {
      return $http.get(configService.getApiUri + '/logs?startDate=' + moment(startDate).format('YYYY-MM-DD') + '&endDate=' + moment(endDate).format('YYYY-MM-DD') + (type ? '&type=' + type : ''))
        .then(function (response) {
          return response.data;
        });
    };

    return {
      getLogs: getLogs
    };
  }
})();