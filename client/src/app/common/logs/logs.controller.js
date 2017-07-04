(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminLogsCtrl', AdminLogsCtrl);

  AdminLogsCtrl.$inject = ['adminLogsService', '$mdSidenav', 'configService'];

  function AdminLogsCtrl(adminLogsService, $mdSidenav, configService) {
    var vm = this;

    vm.startDate = new Date();
    vm.endDate = new Date();
    vm.endDate.setDate(vm.endDate.getDate() + 1);

    vm.type = 'all';
    vm.types = ['all', 'user', 'heater', 'silo', 'system'];

    vm.dateFormat = configService.logDateFormat;

    vm.query = {
      order: '-date',
      limit: 10,
      page: 1
    };

    vm.changeDate = () => {
      getLogs();
    };

    function getLogs() {
      adminLogsService.getLogs(vm.startDate, vm.endDate, (vm.type != 'all' ? vm.type : null))
        .then((logs) => {
          vm.logs = logs;
        });
    }

    getLogs();

    vm.toggleDetail = function (body) {
      if (body) {
        if (!vm.body) {
          vm.body = body;
          $mdSidenav('left').toggle();
        } else if (vm.body == body) {
          $mdSidenav('left').toggle();
        } else {
          vm.body = body;
        }
      } else {
        vm.body = null;
        $mdSidenav('left').toggle();
      }
    };
  }
})();