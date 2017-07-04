(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Project', ProjectFactory);

  /* @ngInject */
  function ProjectFactory(Model, _Object, COLORS) {
    class Project extends Model {
      constructor(project) {
        super(project);
        this.type = 'project';
        this.color = COLORS.project;

        if (this.objects instanceof Array) {
          this.objects.forEach((o, i, arr) => {
            let object = new _Object(o);
            
            object.assignParent(this);
            arr[i] = object;
          });
        }
      }

      get silos() {
        let silos = [];

        this.objects.forEach( o => {
          if (o.silos instanceof Array) {
            silos = silos.concat(o.silos);
          }
        });

        return silos;
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

      get devices() {
        return this.silos.concat(this.heaters);
      }

      addObject(obj) {
        return super.addChild(obj, _Object);
      }

      removeObject(uuid) {
        return super.removeChild(uuid);
      }
      updateObject(obj) {
        const i = this.objects.findIndex(o => o.uuid === obj.uuid);

        if ( i >= 0 ) {
          angular.extend(this.objects[i], obj);
        }
      }
    }

    return Project;
  }
})();