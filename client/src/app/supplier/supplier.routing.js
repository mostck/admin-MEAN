(function() {
  'use strict';
  angular
    .module('heaterSiloM2M.routing')
    .config(routing);

  function routing($stateProvider) {
    $stateProvider
      .state('supplier', {
        url: '/supplier',
        template: '<ui-view/>',
        deepStateRedirect: { default: { state: 'supplier.silos' } }
      })
        .state('supplier.silos', {
          url: '/silos',
          templateUrl: 'app/supplier/silos/silos.html',
          controller: 'supplierSilosAllCtrl',
          controllerAs: 'vm'
        })
        .state('supplier.orders', {
          url: '/orders',
          templateUrl: 'app/supplier/orders/orders.html',
          controller: 'supplierOrdersAllCtrl',
          controllerAs: 'vm'
        })
        .state('supplier.order', {
          url: '/order/:id',
          templateUrl: 'app/supplier/orders/order.html',
          params: {id: null},
          controller: 'supplierOrderCtrl',
          controllerAs: 'vm'
        });
  }
})();