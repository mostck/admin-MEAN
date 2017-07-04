(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .service('compareDateRanges', compareDateRanges);

  compareDateRanges.$inject = [];

  /* @ngInject */
  function compareDateRanges() {
    /* jshint validthis: true */
    this.isIntersected = isIntersected;
    this.isContained = isContained;
    this.isBeyond = isBeyond;
    ////////////////
    function isIntersected(
      {from: from1, to: to1},
      {from: from2, to: to2}
    ) {
      return from1.isBetween(from2, to2, 'd', '[]') ||
             to1.isBetween(from2, to2, 'd', '[]') ||
             from2.isBetween(from1, to1, 'd', '[]') ||
             to2.isBetween(from1, to1, 'd', '[]');
    }

    function isContained(
      {from: from1, to: to1},  // containing
      {from: from2, to: to2}   // contained
    ) {
      return from2.isBetween(from1, to1, 'd', '[]') &&
             to2.isBetween(from1, to1, 'd', '[]');
    }

    function isBeyond(
      {from: from1, to: to1},
      {from: from2, to: to2}
    ) {
      return from1.isBefore(from2) || to1.isAfter(to2);
    }
  }
})();