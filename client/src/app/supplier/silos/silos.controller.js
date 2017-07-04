(function() {
  'use strict';

  angular.module('heaterSiloM2M')
    .controller('supplierSilosAllCtrl', supplierSilosAllCtrl);

  supplierSilosAllCtrl.$inject = ['$state', 'adminProjectService', 'userService'];

  function supplierSilosAllCtrl($state, adminProjectService, userService) {
    /*jshint validthis:true */
    var vm = this;

    vm.querySilos = {
      order: 'serial',
      limit: 5,
      page: 1
    };

    var currentUser = userService.currentUser();

    adminProjectService.getAllProjectsSupplier(currentUser._id)
      .then((projects) => {
        vm.getAllSilos = [];

        projects.forEach(proj => {
          if(proj.archive) return;
          proj.objects.forEach(obj => {
            obj.silos.forEach(silo => {
              if (silo.supplier === currentUser._id) {
                silo.silo.object = obj;
                silo.silo.orders = [];
                silo.orders.forEach(order => {
                  if (order.supplier === currentUser._id) {
                    order.supplier = currentUser;
                    silo.silo.orders.push(order);
                  }
                });
                silo.silo.orders = silo.silo.orders ? silo.silo.orders.filter((order) => {
                  return order.status != 'delivered'
                }) : null;
                vm.getAllSilos.push(silo.silo);
              }
            });
          });
        });

        function unique(arr) {
          var obj = {};
          arr.forEach((elem) => {
            if(obj[elem._id] && obj[elem._id].object) return;
            obj[elem._id] = elem;
          }) ;
          return Object.values(obj);
        }
        // vm.getAllSilos = unique(vm.getAllSilos);
      });

    // adminDeviceService.getAllSilos()
    //   .then( (silos) => {
    //     vm.getAllSilos = silos;
    //   });

    vm.viewSilo = (silo) => {
      $state.go("silo", {id: silo._id});
    };
  }
})();