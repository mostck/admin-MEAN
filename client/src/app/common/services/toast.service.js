(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .service('Toast', Toast);

  Toast.$inject = ['$mdToast', '$translate'];

  /* @ngInject */
  function Toast($mdToast, $translate) {
    this.show = show;
    this.success = success;
    this.error = error;
    ////////////////
    const defaults = {
      position: 'top left',
      hideDelay: 3000
    };

    function show(options) {
      $mdToast.show(angular.extend({}, {
        template: getTemplate(options.content, options.type),
        position: options.position,
        hideDelay: options.hideDelay
      },  defaults));
    }

    function success(text) {
      $mdToast.show(angular.extend({},{
        template: getTemplate(text)
      }, defaults));
    }

    function error(text) {
      $mdToast.show(angular.extend({},{
        template: getTemplate(text, 'error')
      }, defaults));
    }

    function getTemplate(translationId, type="success") {
      return `<md-toast class="toast-${type} angular-animate">
                <div class="md-toast-content">
                  ${$translate.instant(translationId)}
                </div>
              </md-toast>`;
    }
  }
})();