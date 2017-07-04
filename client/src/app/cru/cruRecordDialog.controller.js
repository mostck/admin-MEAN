(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('cruRecordDialogCtrl', cruRecordDialogCtrl);

  /* @ngInject */
  function cruRecordDialogCtrl(
    $scope,
    $mdDialog,
    CRURecord,
    cruRequest,
    adminUserService,
    companyService,
    record,
    deviceId, 
    state
  ) {
    /* jshint validthis: true */
    let company = companyService.getCompanySync(),
      vm = this;


    vm.title = 'cruRecordDialogCtrl';
    vm.state = state;
    vm.reasons = [
      'assembly',
      'disassembly',
      'planned_service',
      'service_repair',
      'alarm'
    ];

    vm.maxSpareParts = 10;
    vm.record = new CRURecord(record || {
      deviceId,
      employees: []
    });

    vm.save = record => {
      cruRequest[state](record).then(res => {
        $mdDialog.hide(res);
      });
    };

    vm.cancel = $mdDialog.hide;
    vm.computeTotalTime = computeTotalTime;

    if (~['create', 'update'].indexOf(vm.state)) {
      $scope.$watchGroup([
        () => vm.record.startDate,
        () => vm.record.endDate,
        () => vm.record.employees
      ], computeTotalTime);
    }

    function computeTotalTime( [startDate, endDate, employees] ) {
      const employeesAmount = employees ? employees.length : 0;
      if (!startDate || !endDate) return;
      if (startDate > endDate) {
        vm.record.endDate = moment(startDate).clone().toDate();
      }
      vm.record.totalTime = timeBetweenDates(startDate, endDate) * employeesAmount;
    }

    const dayStart = toHour(company.officeTime.startTime.toDate()),
          dayEnd = toHour(company.officeTime.endTime.toDate());

    function timeBetweenDates(startDate, endDate) {
      let totalMin = 0,
        current = moment(startDate);

      while (current <= endDate) {
        let currentTime = toHour(current);

        if (currentTime >= dayStart && currentTime < dayEnd) {
          totalMin++;
        }

        current.add(1, 'm');
      }
      return totalMin - 1;
    }

    $scope.hasSpareParts = !!(vm.record.spareParts && vm.record.spareParts.length);

    $scope.$watch('hasSpareParts', (hasSpareParts) => {
      if (hasSpareParts && !vm.record.spareParts) {
        vm.record.addSparePart();
      }
    });

    activate();

    function activate() {
      adminUserService.getAllEmployees()
        .then(function (employees) {
          vm.employees = employees;
        });
    }


    function toHour(date) {
      date = moment(date);

      return date.hour() + date.minute() / 60;
    }
  }
})();