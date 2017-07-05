(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('dialogService', dialogService);

  /* ngInject */
  function dialogService($translate, $mdDialog) {
    const translate = $translate.instant;

    let confirmRemoveItem = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.removeItem.title'))
        .textContent(translate('confirm.removeItem.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    let confirmLeavePage = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.leavePage.title'))
        .textContent(translate('confirm.leavePage.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    let confirmAdjustDuration = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.adjustDuration.title'))
        .textContent(translate('confirm.adjustDuration.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    const dialogConfig = {
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      escapeToClose: true,
      controllerAs: 'vm'
    };

    return {
      confirmRemoveItem     : confirmRemoveItem,
      confirmLeavePage      : confirmLeavePage,
      confirmAdjustDuration : confirmAdjustDuration
    };
  }
})();