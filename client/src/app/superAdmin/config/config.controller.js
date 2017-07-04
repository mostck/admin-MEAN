(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminConfigCtrl', AdminConfigCtrl);

  /* ngInject */
  function AdminConfigCtrl($state, adminConfigService, Toast) {
    var vm = this;

    adminConfigService.getConfig()
      .then( (config) => {
        vm.config = config;
      });

    vm.updateConfig = (config) => {
      adminConfigService.updateConfig(config)
        .then( () => {
          Toast.show({
            content: 'Saved',
            type: 'success'
          });
        });
    };
  }
})();

