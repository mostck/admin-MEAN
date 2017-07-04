describe('compareDateRanges service', function() {
  'use strict';

  var compareDateRanges;

  beforeEach(module('heaterSiloM2M'));

  beforeEach(inject(_compareDateRanges_ => {
    compareDateRanges = _compareDateRanges_;
  }));

  it('init', () => {
    expect(compareDateRanges).toBeDefined();
  });

  describe('isIntersected method', () => {
    it('should be intersected', () => {
      const period1 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-20'),
        },
        period2 = {
          from: moment('2016-11-15'),
          to: moment('2016-11-25'),
        };

      expect(compareDateRanges.isIntersected(period1, period2)).toBe(true);
      expect(compareDateRanges.isIntersected(period2, period1)).toBe(true);
    });

    it('shouldn\'t be intersected', () => {
      const period1 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-20'),
        },
        period2 = {
          from: moment('2016-11-25'),
          to: moment('2016-12-15'),
        };

      expect(compareDateRanges.isIntersected(period1, period2)).toBe(false);
      expect(compareDateRanges.isIntersected(period2, period1)).toBe(false);
    });
  });
  describe('isContained method', () => {
    it('should be contained', () => {
      const period1 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-25'),
        },
        period2 = {
          from: moment('2016-11-15'),
          to: moment('2016-11-20'),
        };

      expect(compareDateRanges.isContained(period1, period2)).toBe(true);
      expect(compareDateRanges.isContained(period2, period1)).toBe(false);
    });

    it('should be contained if the same periods ', () => {
      const period1 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-25'),
        },
        period2 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-25'),
        };

      expect(compareDateRanges.isContained(period1, period2)).toBe(true);
      expect(compareDateRanges.isContained(period2, period1)).toBe(true);
    });

    it('shouldn\'t be contained', () => {
     const period1 = {
          from: moment('2016-11-10'),
          to: moment('2016-11-25'),
        },
        period2 = {
          from: moment('2016-11-15'),
          to: moment('2016-11-20'),
        };

      expect(compareDateRanges.isContained(period2, period1)).toBe(false);
    });
  });

  describe('isBeyond method', () => {
    it('should be beyound', () => {
      const period1 = {
           from: moment('2016-11-10'),
           to: moment('2016-11-25'),
         },
         period2 = {
           from: moment('2016-12-15'),
           to: moment('2016-12-20'),
         };

       expect(compareDateRanges.isBeyond(period2, period1)).toBe(true);
    });
  });

});