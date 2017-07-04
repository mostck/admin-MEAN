(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('HeaterCtrl', HeaterCtrl);

  /* @ngInject */
  function HeaterCtrl(
    $state,
    $stateParams,
    adminDeviceService,
    Heater,
    userService,
    adminCustomerService,
    HeaterService,
    configService,
    adminCompanyService,
    heater
  ) {
    var vm = this;
    vm.title = 'HeaterCtrl';

    var currentUser = userService.currentUser();
    if(currentUser.roleId == 5 || currentUser.roleId == 6) {
      adminCustomerService.getCustomer(currentUser.customer)
        .then((customer) => {
          vm.permissions = customer.permissions;
        });
    }

    vm.daysOfWeek = [];

    vm.updateChart = updateChart;

    vm.changeStatus = () => {
      HeaterService.changeStatus(vm.heater)
        .then((heater) => {
          vm.heater.status = heater.status;
        });
    };

    vm.changeOperationHours = () => {
      HeaterService.changeOperationHours(vm.heater)
        .then((heater) => {
          vm.heater.operationsServiceStatus = heater.operationsServiceStatus;
          vm.heater.periodicServiceStatus = heater.periodicServiceStatus;
          vm.heater.ashLevel = (heater.operationHours - vm.operationsServiceTime * heater.operationsService) / vm.operationsServiceTime * 100;
        });
    };

    vm.sendAlert = () => {
      HeaterService.sendAlert(vm.heater)
        .then((heater) => {
          vm.heater.alert = heater.alert;
        });
    };

    vm.confirmAlert = () => {
      HeaterService.confirmAlert(vm.heater)
        .then((heater) => {
          vm.heater.alert = heater.alert;
        });
    };

    vm.sendServicePeriodic = () => {
      HeaterService.sendService(vm.heater, 'periodic').then((heater) => {
        vm.heater.periodicServiceStatus = heater.periodicServiceStatus;
      });
    };

    vm.confirmServicePeriodic = () => {
      HeaterService.confirmService(vm.heater, 'periodic').then((heater) => {
        vm.heater.periodicServiceStatus = heater.periodicServiceStatus;
      });
    };

    vm.sendServiceOperations = () => {
      HeaterService.sendService(vm.heater, 'operations').then((heater) => {
        vm.heater.operationsServiceStatus = heater.operationsServiceStatus;
      });
    };

    vm.confirmServiceOperations = () => {
      HeaterService.confirmService(vm.heater, 'operations').then((heater) => {
        vm.heater.operationsServiceStatus = heater.operationsServiceStatus;
      });
    };

    activate();

    ////////////////

    function activate() {

      adminCompanyService.getCompany()
        .then( (company) => {
          vm.operationsServiceTime = company.operationsServiceTime;
          // adminDeviceService.getHeater($stateParams.id)
          //   .then( (heater) => {
            vm.heater = new Heater(heater);

            vm.heater.ashLevel = (vm.heater.operationHours - vm.operationsServiceTime * vm.heater.operationsService) / vm.operationsServiceTime * 100;

            if(vm.heater.customer && vm.heater.customer.officeTime) {
              vm.heater.customer.officeTime.daysOfWeek.forEach((id) => {
                vm.daysOfWeek.push(configService.daysOfWeek.find((day) => {
                  return day.id == id;
                }).name);
              });
            }

            // if (vm.heater.projects) {
            vm.scheduleData = vm.heater.getSchedule();
              // }
            // });
        });
    }

    function updateChart() {
      adminDeviceService.getHeater(heater._id)
        .then( heater => {
          vm.scheduleData = new Heater(heater).getSchedule();
        });
    }
  }
})();