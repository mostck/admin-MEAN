(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Model', ModelFactory);

  ModelFactory.$inject = ['rfc4122', '$rootScope'];
  /* @ngInject */
  function ModelFactory(uuid, $rootScope) {
    class Model {
      constructor(item) {
        angular.merge(this, item);
        this.master = item;
        this.uuid = uuid.v4();

        if (typeof(this.startDate) === 'string') {
          this.from = this.startDate;
          this.masterFrom = this.from;
        }
        if (typeof(this.endDate) === 'string') {
          this.to = this.endDate;
          this.masterTo = this.to;
        }
      }

      get from() {
        if (this.startDate) {
          return moment(this.startDate);
        }
      }
      set from(date) {
        this.startDate = moment(date).startOf('d').toDate();
      }

      get to() {
        if (this.endDate) {
          return moment(this.endDate);
        }
      }
      set to(date) {
        this.endDate = moment(date).startOf('d').toDate();
      }

      assignParent(parent) {
        this.parent = parent;
        this.from   = this.from || parent.from;
        this.to     = this.to || parent.to;
      }

      get project() {
        let parent = this.parent;
        while(parent) {
          if (parent.type === 'project') {
            return parent;
          }
          parent = parent.parent;
        }
      }

      get children() {
        return this.objects || this.silos || this.heaters;
      }

      get duration() {
        return moment.duration(this.to - this.from, 'ms');
      }
      resetDate() {
        this.from = this.master.startDate;
        this.to = this.master.endDate;
        if (this.children) {
          this.children.forEach(c => c.resetDate());
        }
      }
      updateChildren() {
        let {from, to} = this;

        if (this.children instanceof Array) {
          this.children.forEach(child => {
            if (from > child.from) {
              let delta = from - child.from;

              child.from = from;
              // when child is smaller of parent move it left
              if (to > child.to) {
                child.to = child.to.add(delta, 'ms');
              }
            }
            if (to < child.to) {
              let delta = child.to - to;

              child.to = to;
              // or right
              if (from < child.from) {
                child.from = child.from.add(-delta, 'ms');
              }
            }
            child.updateChildren();
          });
        }
      }
      removeChild(uuid) {
        const i = this.children.findIndex(c => c.uuid === uuid); 

        if ( i >= 0 ) {
          return this.children.splice(i, 1);
        }
      }
      addChild(childData, ChildModel) {
        if (!this.children.find(c => c._id === childData._id)) {
          let child = new ChildModel( childData );

          child.assignParent(this);
          this.children.push(child);

          return child;
        }
      }
      toJSON() {
        let result = {};
        const tempAttrs = ['uuid', 'parent', 'project', 'children', 'master'];

        for (let x in this) {
          if (~tempAttrs.indexOf(x)) continue;
          if (x === "startDate" || x === "endDate") {
            result[x] = moment(this[x]).format('YYYY-MM-DD');
            continue;
          }
          result[x] = this[x];
        }
        return result;
      }
    }

    return Model;
  }
})();