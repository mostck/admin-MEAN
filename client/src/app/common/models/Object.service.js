(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('_Object', ObjectFactory);

  /* @ngInject */
  function ObjectFactory(Model, Silo, COLORS) {
    class _Object extends Model {
      constructor(object) {
        super(object);
        this.type = 'object';
        this.color = COLORS.object;

        if (this.silos instanceof Array) {
          this.silos.forEach((s, i, arr) => {
            let silo = new Silo(s);
            silo.assignParent(this);
            arr[i] = silo;
          });
        } else {
          this.silos = [];
        }
      }
      get heaters() {
        let heaters = [];

        this.silos.forEach( s => {
          if (s.heaters instanceof Array) {
            heaters = heaters.concat(s.heaters);
          }
        });

        return heaters;
      }
      addDevice(device) {
        return super.addChild(device, Silo);
      }
    }

    return _Object;
  }
})();