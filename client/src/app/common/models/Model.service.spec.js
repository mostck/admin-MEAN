describe('class Model', () => {
  let Model, model;
  let data = readJSON('fixtures/project.json');

  beforeEach(module('heaterSiloM2M'));

  beforeEach(inject(_Model_ => {
    Model = _Model_;
    model = new Model(data);
  }));

  it('init', () => {
    expect(Model).toBeDefined();
  });


  it('should get duration instance of moment.duration', () => {
    expect(moment.isDuration(model.duration)).toBe(true);
  });

  it('should get duration', () => {
    expect(model.duration.asDays()).toEqual(45);
    expect(model.duration.asWeeks() > 6).toBe(true);
    expect(model.duration.asMonths() > 1).toBe(true);
  });

});