(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('HeaterService', HeaterService);

  HeaterService.$inject = ['$http', 'configService'];

  function HeaterService($http, configService) {

    var changeOperationHours = function (heater) {
      return $http.post(configService.getApiUri + '/heaterChangeOperationHours', {id: heater._id, operationHours: heater.operationHours})
        .then(function (response) {
          return response.data;
        });
    };

    var changeStatus = function (heater) {
      return $http.post(configService.getApiUri + '/heaterChangeStatus', {id: heater._id})
        .then(function (response) {
          return response.data;
        });
    };

    var sendAlert = function (heater) {
      return $http.post(configService.getApiUri + '/heaterSendAlert', {id: heater._id})
        .then(function (response) {
          return response.data;
        });
    };

    var confirmAlert = function (heater) {
      return $http.post(configService.getApiUri + '/heaterConfirmAlert', {id: heater._id})
        .then(function (response) {
          return response.data;
        });
    };

    var sendService = function (heater, type) {
      return $http.post(configService.getApiUri + '/heaterSendService', {id: heater._id, type: type})
        .then(function (response) {
          return response.data;
        });
    };

    var confirmService = function (heater, type) {
      return $http.post(configService.getApiUri + '/heaterConfirmService', {id: heater._id, type: type})
        .then(function (response) {
          return response.data;
        });
    };

    return {
      sendAlert: sendAlert,
      confirmAlert: confirmAlert,
      sendService: sendService,
      confirmService: confirmService,
      changeStatus: changeStatus,
      changeOperationHours: changeOperationHours
    };
  }
})();
