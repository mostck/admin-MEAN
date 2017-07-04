describe('Filter: duration', function() {
  var durationFilter;

  beforeEach(module('heaterSiloM2M'));

  beforeEach(inject(_durationFilter_ => {
    durationFilter = _durationFilter_;
  }));

  it('init', () => {
    expect(durationFilter).toBeDefined();
  });

  it('should be able to conver to correct unit', () => {
    let duration = 60 * 100 + 3;
    expect(durationFilter(duration, 'm', 'h:mm')).toBe('100:03');
  });

  it('should return 0 if pass undefined', () => {
    expect(durationFilter(undefined, 's')).toBe('0');
  });

});