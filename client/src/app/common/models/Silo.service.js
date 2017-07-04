(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Silo', SiloFactory);

  SiloFactory.$inject = ['Device', 'Heater', 'COLORS'];

  /* @ngInject */
  function SiloFactory(Device, Heater, COLORS) {
    class Silo extends Device {
      constructor(silo) {
        super(silo);
        this.type = 'silo';
        this.color = COLORS.silo;

        if (!this.silo) this.silo = silo._id;
        if (typeof(this.silo) === 'object') {
          angular.extend(this, this.silo);
        }

        if (this.heaters instanceof Array) {
          this.heaters.forEach((h, i, arr) => {
            let heater = new Heater(h);
            
            heater.assignParent(this);
            arr[i] = heater;
          });
        } else {
          this.heaters = [];
        }
      }
      addDevice(device) {
        return super.addChild(device, Heater);
      }
    }

    return Silo;
  }
})();