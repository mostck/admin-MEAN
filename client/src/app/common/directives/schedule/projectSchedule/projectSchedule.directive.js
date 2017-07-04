(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('projectSchedule', projectSchedule);

  projectSchedule.$inject = ['$window', 'ganttDebounce', '$timeout'];

  /* @ngInject */
  function projectSchedule($window, debounce, $timeout) {
    // Usage:
    //  <schedule-chart projects="projects" options="options"></schedule-chart>
    // Creates:
    //
    let directive = {
      bindToController: true,
      controller: Controller,
      controllerAs: 'ps',
      templateUrl: 'app/common/directives/schedule/projectSchedule/projectSchedule.html',
      restrict: 'AE',
      replace: true,
      scope: {
        project: '=data'
      }
    };
    return directive;
  }
  Controller.$inject = [
    '$scope',
    '$timeout',
    'Schedule',
    'ganttDebounce',
    'ganttMouseOffset',
    'adminDeviceService',
    'COLORS',
    'Silo',
    'Heater'
  ];
  /* @ngInject */
  function Controller($scope,
    $timeout,
    Schedule,
    debounce,
    mouseOffset,
    deviceService,
    COLORS,
    Silo,
    Heater
  ) {
    let vm = this,
      MIN_DURATION = 24 * 60 * 60 * 1000,
      object, transferedDevice;

    $scope.UTIL_COLORS = {
      1: COLORS.partialAvailable, // yellow
      2: COLORS.available    // green
    };

    let duration = vm.project.duration;

    vm.viewScale = getScale(duration);

    vm.options = {
      currentDate       : 'none',
      treeTableColumns  : [],
      columnWidth       : getColumnWidth( vm.viewScale ),
      rowContent        : '{{row.model.title}}',
      taskContent       : '{{task.model.title}}',
      columnMagnet      : '1 day',
      allowSideResizing : false,
      viewScale         : getScale(duration),
      headersFormats : {
        month: c => moment(c.date).format(getMonthFormat(vm.options.viewScale))
      },
      tooltip: {
        content: `{{task.model.title}}</br>
                  <small>
                    {{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}
                  </small>`
      }
      // filterRow(row) {
      //   const gantt = row.rowsManager.gantt;
      //   // show projects that there are only in range of a chart
      //   return gantt.getPositionByDate(row.to) > 0 &&
      //     gantt.getPositionByDate(row.from) < gantt.width;
      // }
    };

    vm.dragStartHandler = (ev, device) => {
      ev.dataTransfer.effectAllowed ='move';
      // for firefox
      ev.dataTransfer.setData('device', 'anything');
      transferedDevice = device;
    };

    vm.availableFilter = (device) => {
      if (!isAvailable(device)) return;

      return !vm.project.devices.some(d => {
        return d._id === device._id;
      });
    };

    function isAvailable(device) {
      device.availability = device.getAvailability(vm.project);
      return device.availability > 0;
    }

    vm.autoFill = Schedule.autoFill.bind(Schedule);


    $scope.$on('changeLanguage', (event, locale) => {
      vm.options.headersFormats.month = c => {
        return moment(c.date).locale(locale).format(getMonthFormat(vm.options.viewScale));
      };
    });

    $scope.$watch('ps.isOpenDevices', () => {
      if (Schedule.api) {
        $timeout(Schedule.api.columns.refresh, 400);
      }
    });

    $scope.$watchGroup([
        () => vm.project.startDate,
        () => vm.project.endDate
        ],
      ([startDate, endDate]) => {
        if (startDate && endDate) {
          let duration = moment.duration(endDate - startDate, 'ms');
          vm.options.viewScale = getScale(duration);
          vm.options.columnWidth = getColumnWidth(vm.options.viewScale);
          if (vm.options.viewScale === 'day') {
            vm.options.fromDate = moment(startDate).add(-3, vm.options.viewScale);
            vm.options.toDate = moment(endDate).add(30, vm.options.viewScale);
          } else {
            vm.options.fromDate = moment(startDate).add(-1, vm.options.viewScale);
          }
          if ($scope.api) $timeout(() => $scope.api.scroll.toDate(startDate));
        }
    });


    function getScale(duration) {
      return duration.asMonths() > 12 ? 'quarter' : duration.asMonths() > 2 ? 'month' : duration.asWeeks() > 4 ? 'week' :  'day';
    }
    function getColumnWidth(scale) {
      return scale === 'day' ? 20 : undefined;
    }
    function getMonthFormat(scale) {
      return scale !== 'month'? 'MMMM YYYY' : 'MMMM';
    }

    // disabling auto-fill button if storage isn't have available devices 
    // and project - empty objects
    $scope.$watchGroup([
      () => {
        return $scope.filtredDevices &&
               $scope.filtredDevices.some( d => d.availability === 2 );
      },
      () => {
        return vm.project.objects.some( o => {
          return o.numberSilos > o.silos.length ||
                 o.numberHeaters > o.heaters.length;
        });
      }
    ], ([hasAvailableDevices, hasEmptyObjects]) => {
      vm.autoFillDisabled = !hasAvailableDevices || !hasEmptyObjects;
    });

    deviceService.getAll().then(devices => {
      vm.devices = devices;
    });



    vm.registredApi = api => {
      // console.log(api);
      $scope.api = api;
      $scope.options = vm.options;

      let handlers = {
        init(task) {
          task.hierarchy = api.tree.getHierarchy();
          task.parent = task.hierarchy.parent(task.row);
          task.children = task.hierarchy.descendants(task.row);
        },
        moveBegin(task) {
          handlers.init(task);
          task.originalFrom = task.model.from;
          task.originalTo = task.model.to;
          task.duration = task.model.to - task.model.from;
          task.originalRow = task.row;
        },
        moveEnd(task) {
          let { model } = task;
          if (task.$element){
            task.$element.removeClass('is-moving');
          }
          // update model
          Schedule.updateItemDate(model.data, model, true)
            .then(() => {
              // and children items
              if (task.children && task.children.length) {
                for(let {tasks: [child]} of task.children) {
                  Schedule.updateItemDate(child.model.data, child.model, false);
                  if (child && child.$element){
                    child.$element.removeClass('is-moving');
                  }
                }
              }
            })
            .finally(() => {
              delete task.duration;
              delete task.originalFrom;
              delete task.originalTo;
              delete task.hierarchy;
              delete task.parent;
              delete task.children;
              delete task.originalRow;

              Schedule.updating = false;

              $timeout(() => Schedule.updateChartData());
              api.scroll.toDate(task.model.from);
            });
          // $scope.$apply();
        },
        move(task) {
          let model = task.model;
          // if row was changed
          if (task.originalRow !== task.row) {
            // Schedule.removeDevice(task.model._id)
            console.log('row changed');
          }

          // expand date range of chart
          // if (vm.options.fromDate.isAfter(model.from)) {
          //   vm.options.fromDate = model.from.clone();
          // }

          // if (vm.options.toDate.isBefore(model.to)) {
          //   vm.options.toDate = model.to.clone();
          // }


          // if task and children elements don't have class 'is-moving' 
          if (!~[...task.$element[0].classList].indexOf('is-moving')) {
            task.$element.addClass('is-moving');
            for(let {tasks: [child]} of task.children) {
              if (child && child.$element) {
                child.$element.addClass('is-moving');
              }
            }
          }

          // disallow to leave parent bounds
          if (task.parent && model.type === 'object') {
            let parentModel = task.parent.tasks[0].model;
            if (parentModel.from >= model.from) {
              task.model.from = parentModel.from.clone();
              task.model.to = parentModel.from.clone().add(task.duration, 'ms');
            }

            if (parentModel.to <= model.to) {
              task.model.to = parentModel.to.clone();
              task.model.from = parentModel.to.clone().add(-task.duration, 'ms');
            }
            task.updatePosAndSize();
          }

          // move children with parent
          if (task.children.length) {
            let {from} = task.model;
            moveChildren(task.children, task.originalFrom - from);
            task.originalFrom = from.clone();
          }
        },
        resizeBegin(task) {
          handlers.init(task);
          task.originalFrom = task.model.from;
          task.originalTo = task.model.to;
        },
        resize(task) {
          let model = task.model;

          if (model.to - model.from === MIN_DURATION) {
            task.originalFrom = task.model.from;
            task.originalTo = task.model.to;
          }
          // min duration
          if (model.to - model.from < MIN_DURATION) {
            if (isResizeRight(task)) {
              model.to = task.originalTo.clone();
            }
            if (isResizeLeft(task)) {
              model.from = task.originalFrom.clone();
            }
          // resize children when needed
          } else if (task.children.length) {
            resizeCildren(task, task.children);
          }
          // disallow to leave parent bounds
          if (task.parent && model.type === 'object') {
            let {from: pFrom, to: pTo} = task.parent.tasks[0].model;

            if (pFrom > model.from) {
              model.from = pFrom.clone();
            }

            if (pTo < task.model.to) {
              model.to = pTo.clone();
            }
          }
          task.updatePosAndSize();

        },
        change({model}) {
          // Schedule.updateItem(model.data, model);
        },
        add({model}) {
          // console.log(model.title);
          // Schedule.updateItem(model.data, model);
        },
        collapsed(scope, row) {
          // console.log(row);
          // api.tree.getHierarchy().descendants(row).forEach(({tasks:[task]}) => {
          //   task.model.movable.allowMoving = !api.tree.isCollapsed(row.model.id);
          // });
        }
      };



      api.core.on.rendered($scope, () => {
        // let updateData = () => {
        //   Schedule.updateData()
        // };

        Schedule.init(api, vm.project);
        vm.chartData = Schedule.getChartData();
        $scope.schedule = Schedule;

        // updateData();

        $scope.$watchCollection(
          () => vm.project, 
          () => {
            Schedule.updateChartData();
          }
        );

        api.data.on.change($scope, (newData, oldData) => {
          $timeout(api.side.setWidth);
        });
        api.tasks.on.move($scope, handlers.move);
        api.tasks.on.moveEnd($scope, handlers.moveEnd);
        api.tasks.on.resizeBegin($scope, handlers.resizeBegin);
        api.tasks.on.resize($scope, handlers.resize);
        api.tasks.on.resizeEnd($scope, handlers.moveEnd);
        api.tasks.on.change($scope, handlers.change);
        api.tasks.on.add($scope, handlers.add);
        api.tree.on.collapsed($scope, handlers.collapsed);
      });
      
      // Add DOM events
      api.directives.on.new($scope, (dName, dScope, element) => {
        if (dName === 'ganttTask' &&
            ~['object', 'silo'].indexOf(dScope.task.model.type)) {
          let dragCounter = 0;

          element
            .bind('drop', ev => {
                let device = transferedDevice,
                  {model:parent} = dScope.task;

              if (device.type === 'silo' && parent.type === 'object' ||
                device.type === 'heater' && parent.type === 'silo') {


                Schedule.addDevice(device, parent.data);
                dScope.$apply();

                transferedDevice = null;
              }
              // element.removeClass('on-drag-hover');
            })
            // .bind('dragenter', ev => {
            //   dragCounter++;
            //   element.addClass('on-drag-hover');
            // })
            // .bind('dragleave', ev => {
            //   dragCounter--;
              
            //   if (dragCounter === 0) {
            //     element.removeClass('on-drag-hover');
            //   }
            // })
            .bind('dragover', ev => {
              ev.preventDefault();
            });
        }
        // indicate inactive tasks
        if (dName === 'ganttBody') {
          let dragCounter = 0;

          element
            .bind('dragenter', ev => {
              dragCounter++;
              element.addClass('on-drag-hover');
            })
            .bind('dragleave', ev => {
              dragCounter--;
              
              if (dragCounter === 0) {
                element.removeClass('on-drag-hover');
              }
            })
            .bind('drop', ev => {
              dragCounter = 0;
              element.removeClass('on-drag-hover');
            });
        }

        if (dName === 'ganttColumnHeader') {
          // console.log(dScope);
        }
        if (dName === 'ganttColumn') {
          if (+dScope.column.endDate === +moment().startOf('d').add(1, 'd')) {
            element.css({
              'background-color': 'green',
              'opacity': 0.6
            });
          }
        }
        if (dName === 'ganttTask') {
          let {task, task:{model}} = dScope;
          // use native event for precise detection of a start moving
          let foregroundElement = task.getForegroundElement();
          let contentElement = task.getContentElement();
          
          element
            .bind('mousedown', () => {
              handlers.moveBegin(task);
            });
            // .bind('mousemove', (evt) => {
            //   let distance = 15;
            //   // prevent change of the past
            //   if (model.from < today()) {
            //     let mouseOffsetX = mouseOffset.getOffsetForElement(foregroundElement[0], evt).x;
            //     model.movable.allowResizing =  mouseOffsetX > distance;
            //   }
            //   if (model.to < today()) {
            //     let mouseOffsetX = mouseOffset.getOffsetForElement(foregroundElement[0], evt).x;

            //     model.movable.allowResizing = mouseOffsetX < foregroundElement[0].offsetWidth - distance;
            //   }
            //   if (task.left + task.width <= api.core.getPositionByDate(today().add(1, 'd'))) {
            //     let x = api.core.getPositionByDate(today().add(1, 'd'));
            //     task.setTo(x, true);
            //     evt.stopPropagation();
            //   }
            // });
        }
      });
    };



    function isResizeRight(task) {
      return task.model.from === task.originalFrom;
    }
    function isResizeLeft(task) {
      return task.model.to === task.originalTo;
    }
    function today() {
      return moment().startOf('day');
    }
    function isInUse(model) {
      return model.startDate <= today();
    }
    function resizeCildren(parent, children) {
      let {from: pFrom, to: pTo} = parent.model;

      children.forEach(row => {
        if (row.tasks.length) {
          row.tasks.forEach(child => {
            if (pFrom > child.model.from) {
              let delta = pFrom - child.model.from;

              child.model.from = pFrom.clone();
              // when child is smaller of parent move it left
              if (pTo > child.model.to) {
                child.model.to.add(delta, 'ms');
              }
            }
            if (pTo < child.model.to) {
              let delta = child.model.to - pTo;

              child.model.to = pTo.clone();
              // or right
              if (pFrom < child.model.from) {
                child.model.from.add(-delta, 'ms');
              }
            }
          });
          row.updateTasksPosAndSize();
        }
      });
    }

    function moveChildren(children, delta) {
      children.forEach(row => {
        if (row.tasks.length) {
          row.tasks.forEach(task => {
            task.model.from.subtract(delta, 'ms');
            task.model.to.subtract(delta, 'ms');
          });
          row.updateTasksPosAndSize();
        }
      });
    }
  }
})();