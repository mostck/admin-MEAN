(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminDevicesAllCtrl', AdminDevicesAllCtrl);

  AdminDevicesAllCtrl.$inject = ['$state', 'adminDeviceService', 'dialogService', '$rootScope', 'adminCompanyService', 'configService'];

  /* @ngInject */
  function AdminDevicesAllCtrl($state, adminDeviceService, dialogService, $rootScope, adminCompanyService, configService) {
    var vm = this;
    vm.title = 'AdminDevicesAllCtrl';

    vm.permission = $rootScope.userRole == 3 && ($rootScope.userPermissions && !$rootScope.userPermissions.devices.write);

    vm.querySilos = {
      order: 'serial',
      limit: 5,
      page: 1
    };
    vm.queryHeaters = {
      order: 'serial',
      limit: 5,
      page: 1
    };

    vm.dateFormat = configService.dateFormat;

    vm.removeSilo = (silo) => {
      let ok = () => {
        vm.getAllSilos.splice(vm.getAllSilos.indexOf(silo), 1);
        adminDeviceService.removeSilo(silo._id);
      };
      dialogService.confirmRemoveItem(ok);
    };
    
    vm.removeHeater = (heater) => {
      let ok = () => {
        vm.getAllHeaters.splice(vm.getAllHeaters.indexOf(heater), 1);
        adminDeviceService.removeHeater(heater._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    activate();

    ////////////////

    function activate() {
      adminCompanyService.getCompany()
        .then( (company) => {
          vm.operationsServiceTime = company.operationsServiceTime;
          adminDeviceService.getAllHeaters()
            .then( (heaters) => {
              heaters.forEach((heater) => {
                if(heater.operationHours && heater.operationsService && vm.operationsServiceTime) {
                  heater.ashLevel = (heater.operationHours - vm.operationsServiceTime * heater.operationsService) / vm.operationsServiceTime * 100;
                }
              });
              vm.getAllHeaters = heaters;
            });
        });

      adminDeviceService.getAllSilos()
        .then( (silos) => {
          silos.forEach((silo) => {
            if(silo.fillingLevel && silo.fillingLevel) {
              // silo.percent = silo.fillingLevel/silo.maxLoad*100;
              silo.percent = silo.fillingLevel;
              silo.orders = silo.orders ? silo.orders.filter((order) => {
                return order.status != 'delivered'
              }) : null;
            }
          });
          vm.getAllSilos = silos;
        });
    }
  }
})();