(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Schedule', Schedule);

  Schedule.$inject = [
    '$rootScope',
    '$q',
    '$timeout',
    '$templateCache',
    'COLORS',
    'Toast',
    'adminProjectService',
    'dialogService',
    'ganttArrays',
    'compareDateRanges'
  ];

  /* @ngInject */
  function Schedule(
    $rootScope,
    $q,
    $timeout,
    $templateCache,
    COLORS,
    Toast,
    adminProjectService,
    dialogService,
    arrays,
    compare
  ) {

    return {
      init(api, data) {
        this.api = api;
        this.projects = data instanceof Array ? data : [data];
        this.data = [];
        this.updateChartData();
      },
      updateChartData() {
        if (!this.updating) {
          this.update();
          this.data.length = 0;
          angular.extend(this.data, Object.values(this.rowsMap));
          this.ready = true;
        }
      },
      update() {
        this.itemsMap = {};
        this.rowsMap = {};
        this.projects.forEach(this._mapData, this);
      },
      _mapData(item) {
        this.itemsMap[item.uuid] = item;
        this.rowsMap[item.uuid] = toRow(item);
        if (item.children) {
          item.children.forEach(this._mapData, this);
        }
      },
      addDevice(device, parent) {
        device = parent.addDevice(device);

        if (device) {
          this.addRow(device);
          this.itemsMap[device.uuid] = device;
        }
      },
      addRow(data) {
        const row = toRow(data);

        this.rowsMap[data.uuid] = row;
        this.data.push(row);
      },
      removeRow(uuid) {
        const model = this.itemsMap[uuid],
          i = this.data.findIndex(row => row.uuid === uuid);

        while(model.children && model.children.length) {
          this.removeRow(model.children[0].uuid);
        }

        model.parent.removeChild(model.uuid);
        this.data.splice(i, 1);
        delete this.itemsMap[uuid];
        delete this.rowsMap[uuid];
      },
      updateRow(id) {
        angular.extend(this.rowsMap[id], toRow(this.itemsMap[id]));
      },
      getChartData() {
        return this.data;
      },
      updateItemDate(model, { from, to }, checkBounds) {
        let d = $q.defer(),
          project =  model.project,
          period = { from, to };

        this.updating = true;

        if (checkBounds && project && compare.isBeyond(period, project)) {
          $timeout(() => {
            dialogService.confirmAdjustDuration( d.resolve, d.reject );
          });
        } else { d.resolve(); }

        d.promise
          .then(() => {
            if (model.parent && checkBounds) this._updateParentsDate(model.parent, period);
            angular.extend(model, period);
          })
          .catch(() => {
            this.updating = false;
            this.updateChartData();
          });
        return d.promise;
      },
      autoFill(devices) {
        devices = devices.filter(d => d.availability === 2);

        let objects = this._getItems('object'),
          freeSilos = devices.filter(d => d.type === 'silo'),
          freeHeaters = devices.filter(d => d.type === 'heater');


        objects.forEach(o => {
          let numberSilos = o.numberSilos - (o.silos ? o.silos.length : 0),
            numberHeaters = o.numberHeaters;

          while(numberSilos > 0 && freeSilos.length) {
            this.addDevice(freeSilos.shift(), o);
            numberSilos--;
          }

          o.silos.forEach(s => {
            let maxHeaters = 6;

            numberHeaters = numberHeaters - (s.heaters ? s.heaters.length : 0);

            while(numberHeaters > 0 && freeHeaters.length && maxHeaters--) {
              this.addDevice(freeHeaters.shift(), s);
              numberHeaters--;
            }
          });
        });

      },
      refresh() {},
      reset() {
        this.projects.forEach(p => p.resetDate());
      },
      // update recursively
      _updateParentsDate(item, {from, to}) {
        angular.extend(item, {
          from: moment.min(item.from, from),
          to: moment.max(item.to, to)
        });
        if (item.parent) {
          this._updateParentsDate(item.parent, {from, to});
        }
      },
      _getItems(type) {
        return Object.keys(this.itemsMap)
          .map(id => this.itemsMap[id])
          .filter(item => item.type === type);
      },
      isDevice,
      changeSupplier(silo) {
        dialogService.dialogSupplier(silo.supplier)
          .then((supplier) => {
            silo.supplier = supplier;
          });
      }
    };

    function isDevice(model) {
      return ~['silo', 'heater'].indexOf(model.type);
    }

    function isInUse(model) {
      return model.startDate <= moment();
    }

    function toRow(model) {
      return {
        name   : model.uuid,
        uuid   : model.uuid,
        parent : model.parent && model.parent.uuid,
        title  : model.name || model.serial,
        tasks  : [{
          name    : model.uuid,
          uuid    : model.uuid,
          title   : model.name || model.serial,
          data    : model,
          from    : model.from,
          to      : model.to,
          masterFrom    : moment(model.master.startDate),
          masterTo      : moment(model.master.endDate),
          color   : model.color,
          classes : [model.type],
          type    : model.type,
          movable: {
            // allowRowSwitching: type === 'device',
            // allowResizing: model.type !== 'project',
            // allowMoving:!isInUse(model),
          },
          tooltips: {
            dateFormat: 'DD/MM/YYYY'
          },
          content: getContent(model)
        }]
      };
    }


    function getContent(model) {
      return $templateCache.get(model.type + 'Task.tmpl.html');
    }

  }
})();