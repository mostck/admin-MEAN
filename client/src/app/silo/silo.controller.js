(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('SiloCtrl', SiloCtrl);

  /* @ngInject */
  function SiloCtrl(
    adminDeviceService,
    SiloService,
    Silo,
    Toast,
    configService,
    $translate,
    silo
  ) {
    var vm = this;
    vm.title = 'SiloCtrl';
    vm.updateChart = updateChart;
    vm.dateFormat = configService.dateFormat;

    activate();

    ////////////////

    function activate() {
      vm.silo = new Silo(silo);
      // vm.percent = vm.silo.fillingLevel / vm.silo.maxLoad * 100;
      vm.percent = vm.silo.fillingLevel;
      if(silo.estimateTime) vm.estimateDate = moment.duration(silo.estimateTime)._data;
      // if(silo.estimateTime) {
      //   var estimateDate = silo.estimateTime - (moment() - moment(silo.changeFillingLevelDate));
      //   if(estimateDate > 0) vm.estimateDate = moment.duration(estimateDate)._data;
      // }

      if (vm.silo.projects) {
        vm.scheduleData = vm.silo.getSchedule();
      }
    }

    function updateChart() {
      adminDeviceService.getSilo(silo._id)
        .then( silo => {
          vm.scheduleData = new Silo(silo).getSchedule();
        });
    }

    vm.changeFillingLevel = () => {
      SiloService.changeFillingLevel(vm.silo)
        .then((silo) => {
          if(silo.estimateTime) {
            vm.estimateDate = moment.duration(silo.estimateTime)._data;
          } else {
            vm.estimateDate = null;
          }
          vm.percent = vm.silo.fillingLevel / vm.silo.maxLoad * 100;
          if(silo.reminderStatus === 0 && vm.percent <= 50 && vm.percent > 30) {
            SiloService.sendReminder(silo, vm.percent, vm.estimateDate)
              .then((_silo) => {
                vm.silo.reminderStatus = _silo.reminderStatus;
                if(!vm.silo.supplier) return;
                $translate('device.messageFillingLevel50')
                  .then((message) => {
                    Toast.show({
                      content: message,
                      type: 'success'
                    });
                  });
              });
          } else if(vm.silo.reminderStatus == 1 && vm.percent <= 30) {
            SiloService.sendReminder(silo, vm.percent, vm.estimateDate)
              .then((_silo) => {
                vm.silo.reminderStatus = _silo.reminderStatus;
                if(!vm.silo.supplier) return;
                $translate('device.messageFillingLevel30')
                  .then((message) => {
                    Toast.show({
                      content: message,
                      type: 'success'
                    });
                  });
              });
          }
        });
    };
  }
})();