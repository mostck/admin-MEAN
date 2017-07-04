(() => {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminOrdersUpdateCtrl', AdminOrdersUpdateCtrl);

  /* @ngInject */
  function AdminOrdersUpdateCtrl(
    adminOrderService, configService, $stateParams, Toast, $state, order) {
    var vm = this;
    vm.title = 'AdminOrdersAllCtrl';
    vm.dateFormat = configService.dateFormat;


    vm.confirmed = (order) => {
      order.status = 'confirmed';

      adminOrderService.update(order).then(res => {
        $state.go('admin.orders.all');
        Toast.success('alert.confirmed');
      });
    };

    vm.delivered = (order) => {
      order.status = 'delivered';

      adminOrderService.update(order).then(res => {
        $state.go('admin.orders.all');
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
      // adminOrderService.get($stateParams.id)
      //   .then( order => {
          order.createdAt = new Date(order.createdAt);
          order.plannedDeliveryAt = order.plannedDeliveryAt ? new Date(order.plannedDeliveryAt) : new Date();
          vm.order = order;
          if(vm.order.status != 'open') {
            vm.order.deliveredAt = vm.order.deliveredAt ? new Date(vm.order.deliveredAt) : new Date();
            vm.changeCHF();
          }
        // });
    }
  }
})();