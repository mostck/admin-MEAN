(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('logbook', logbook);

  /* @ngInject */
  function logbook() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      bindToController: true,
      controller: Controller,
      controllerAs: 'vm',
      templateUrl: 'app/common/directives/logbook/logbook.html',
      restrict: 'AE',
      scope: {
        records: '=',
        device: '='
      }
    };
    return directive;

  }

  /* @ngInject */
  function Controller($scope, dialogService) {
    let vm = this,
      ParentCtrl = $scope.$parent.vm;

    vm.dateFormat = 'dd/MM/yyyy - HH:mm';

    vm.query = {
      order: 'startDate',
      limit: 10,
      page: 1
    };

    vm.addCRURecord = () => {
      dialogService.cruRecordDialog(null, vm.device && vm.device._id, 'create').then( record => {
        if (record) {
          vm.records.push(record);
          ParentCtrl.updateChart();
        }
      });
    };

    vm.viewCRURecord = record => {
      dialogService.cruRecordDialog(record, null,  'view');
    };

    vm.editCRURecord = record => {
      dialogService.cruRecordDialog(record, null,  'update').then(record => {
        const index = vm.records.findIndex(r => r._id === record._id);
        angular.extend(vm.records[index], record);
        ParentCtrl.updateChart();
      });
    };
  }
})();