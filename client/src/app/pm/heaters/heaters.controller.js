(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('pmHeatersAllCtrl', pmHeatersAllCtrl);

  pmHeatersAllCtrl.$inject = ['$state', 'adminProjectService', 'userService', 'adminCompanyService', 'adminCustomerService'];

  function pmHeatersAllCtrl($state, adminProjectService, userService, adminCompanyService, adminCustomerService) {
    /*jshint validthis:true */
    var vm = this;
    var currentUser = userService.currentUser();

    if(currentUser.roleId == 5 || currentUser.roleId == 6) {
      adminCustomerService.getCustomer(currentUser.customer)
        .then((customer) => {
          vm.permissions = customer.permissions;
        });
    }

    vm.query = {
      order: 'serial',
      limit: 10,
      page: 1
    };

    adminCompanyService.getCompany()
      .then( (company) => {
        vm.operationsServiceTime = company.operationsServiceTime;
        adminProjectService.getAllProjectsCustomer(currentUser.customer)
          .then((projects) => {
            if (currentUser.roleId == 6) {
              vm.getAllProjects = projects.filter(proj => {
                return proj.pm == currentUser._id;
              });
            } else {
              vm.getAllProjects = projects;
            }
            vm.getAllHeaters = [];
            vm.getAllProjects.forEach(proj => {
              if(proj.archive) return;
              proj.objects.forEach(obj => {
                obj.silos.forEach(silo => {
                  silo.heaters.forEach(heater => {
                    heater.heater.ashLevel = (heater.heater.operationHours - vm.operationsServiceTime * heater.heater.operationsService) / vm.operationsServiceTime * 100;
                    vm.getAllHeaters.push(heater.heater);
                  });
                });
              });
            });

            function unique(arr) {
              var obj = {};
              arr.forEach((elem) => {
                obj[elem._id] = elem;
              }) ;
              return Object.values(obj);
            }
            // vm.getAllHeaters = unique(vm.getAllHeaters);

          });
      });



    vm.viewHeater = (heater) => {
      $state.go("heater", {id: heater._id});
    };
  }
})();