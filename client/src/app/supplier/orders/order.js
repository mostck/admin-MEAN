(() => {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('supplierOrderCtrl', supplierOrderCtrl);

  supplierOrderCtrl.$inject = ['adminOrderService', 'configService', '$stateParams', 'Toast', '$state'];

  /* @ngInject */
  function supplierOrderCtrl(orderService, configService, $stateParams, Toast, $state) {
    /* jshint validthis: true */
    var vm = this;
    vm.title = 'AdminOrdersAllCtrl';
    vm.dateFormat = configService.dateFormat;


    vm.confirmed = (order) => {
      order.status = 'confirmed';

      orderService.update(order).then(res => {
        $state.go('supplier.orders');
        Toast.success('alert.confirmed');
      });
    };

    vm.delivered = (order) => {
      order.status = 'delivered';

      orderService.update(order).then(res => {
        $state.go('supplier.orders');
        Toast.success('alert.delivered');
      });

    };

    vm.changeCHF = () => {
      vm.order.amountCHFPerTon = vm.order.amountCHF / vm.order.amountOfTons;
    };
    vm.changeCHFPerTon = () => {
      vm.order.amountCHF = vm.order.amountCHFPerTon * vm.order.amountOfTons;
    };

    activate();

    ////////////////

    function activate() {
      orderService.get($stateParams.id)
        .then( order => {
          order.createdAt = new Date(order.createdAt);
          order.plannedDeliveryAt = order.plannedDeliveryAt ? new Date(order.plannedDeliveryAt) : new Date();
          vm.order = order;
          if(order.status != 'open') {
            vm.order.deliveredAt = vm.order.deliveredAt ? new Date(vm.order.deliveredAt) : new Date();
            vm.changeCHF();
          }
        });
    }
  }
})();