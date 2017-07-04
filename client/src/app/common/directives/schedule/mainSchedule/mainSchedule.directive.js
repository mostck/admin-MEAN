(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('mainSchedule', mainSchedule);

  mainSchedule.$inject = ['$window', 'ganttDebounce'];

  /* @ngInject */
  function mainSchedule($window, debounce) {
    // Usage:
    //  <schedule-chart projects="projects" options="options"></schedule-chart>
    // Creates:
    //
    let directive = {
      bindToController: true,
      controller: Controller,
      controllerAs: 'ms',
      templateUrl: 'app/common/directives/schedule/mainSchedule/mainSchedule.html',
      restrict: 'AE',
      replace: true,
      scope: {
        data: '=',
        options: '=',
        silosLength: '=',
        allowResizing: '='
      }
    };
    return directive;

  }
  Controller.$inject = ['$scope', 'Schedule', 'ganttDebounce', 'ganttMouseOffset', 'adminDeviceService'];
  /* @ngInject */
  function Controller($scope, Schedule, debounce, mouseOffset, adminDeviceService) {
    let vm = this,
      MIN_DURATION = 24 * 60 * 60 * 1000,
      object;

    $scope.$on('changeLanguage', (event, locale) => {
      vm.options.headersFormats.month = c => moment(c.date).locale(locale).format('MMMM');
    });
    
    vm.registredApi = api => {
      $scope.api = api;
      $scope.options = vm.options;

      init();

      function init() {
        Schedule.init(api, vm.data);
        vm.chartData = Schedule.getChartData();
        vm.silos = [];
        vm.chartData.forEach(el => {
          if(el.tasks[0].type == 'silo'){
            vm.silos.push(el.tasks[0].data);
          }
        });
      }


      api.core.on.rendered($scope, () => {
        $scope.schedule = Schedule;

        $scope.$watchCollection(() => vm.data, () => {
          Schedule.updateChartData();
        });

        // $scope.$watch(() => JSON.stringify(vm.chartData), () => {
        //   console.log('updated');
        // });

        if (vm.allowResizing) {
          api.tasks.on.resize($scope, resize);
          api.tasks.on.resizeEnd($scope, resizeEnd);
        }
      });

      // function resizeBegin(task) {
      //   task.originalFrom = task.model.from;
      //   task.originalTo = task.model.to;
      // }
      function resize(task) {
        let {model} = task;

        if (model.to < model.masterTo) {
          model.to = model.masterTo.clone();
        }

        task.updatePosAndSize();
      }
      function resizeEnd(task) {
        let { model } = task;

        // delete task.originalFrom;
        // delete task.originalTo;

        // update model
          Schedule.updateItemDate(model.data, model, true)
            // .then(() => {
            //   // and children items
            //   if (task.children && task.children.length) {
            //     for(let {tasks: [child]} of task.children) {
            //       Schedule.updateItemDate(child.model.data, child.model, false);
            //       if (child && child.$element){
            //         child.$element.removeClass('is-moving');
            //       }
            //     }
            //   }
            // })
            .finally(() => {
              // delete task.duration;
              // delete task.originalFrom;
              // delete task.originalTo;
              // delete task.hierarchy;
              // delete task.parent;
              // delete task.children;
              // delete task.originalRow;

              Schedule.updating = false;
              console.log('update chart data ');
              $timeout(() => Schedule.updateChartData());
              // api.scroll.toDate(task.model.from);
            });
      }
      // Add DOM events
      api.directives.on.new($scope, (dName, dScope, element) => {

        if (dName === 'ganttColumnHeader' && vm.silosLength && dScope.column.unit === 'day') {
          // console.log('dScope', dScope)
          // console.log('column.endDate', new Date(dScope.column.endDate))
          // console.log('element', element)
          let length = 0;
          vm.silos.forEach(el => {
            if(moment(el.startDate) < moment(dScope.column.endDate) && moment(el.endDate).add(1, 'd') >= moment(dScope.column.endDate)){
              length = length + 1;
            }
          });

          var percent = length/vm.silosLength*100;
          if(percent < 50) {
            element.css({
              'background-color': 'darkseagreen',
              'opacity': 1
            });
          } else if(percent < 80){
            element.css({
              'background-color': 'orange',
              'opacity': 1
            });
          } else {
            element.css({
              'background-color': 'lightcoral',
              'opacity': 1
            });
          }
        }
        if (dName === 'ganttTask') {
          element.on('dblclick', (evt) => {
            let {task} = dScope,
              {row:{model:{id:rowId}}} = task;

            if (task.row._collapsed) {
              api.tree.expand(rowId);
            } else {
              api.tree.collapse(rowId);
            }
            dScope.$apply();
          });

          // resizing
          if (vm.allowResizing) {
            let {task, task:{model}} = dScope;
            // use native event for precise detection of a start moving
            let foregroundElement = task.getForegroundElement();
            let contentElement = task.getContentElement();
            
            element
              // .bind('mousedown', () => {
              //   resizeBegin(task);
              //   console.log(task);
              // })
              .bind('mousemove', evt => {
                let distance = 15,
                    mouseOffsetX = mouseOffset.getOffsetForElement(foregroundElement[0], evt).x;

                if (vm.allowResizing.future) {
                  model.movable.allowResizing = mouseOffsetX > distance;
                }

                if (vm.allowResizing.past) {
                  model.movable.allowResizing = mouseOffsetX < foregroundElement[0].offsetWidth - distance;
                }
              });
          }
        }
        if (dName === 'ganttColumn') {
          // highlight today on chart
          if (+dScope.column.endDate === +moment().startOf('d').add(1, 'd')) {
            element.css({
              'background-color': 'green',
              'opacity': 0.6
            });
          }
        }
      });
    };
  }
})();