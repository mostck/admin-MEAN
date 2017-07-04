describe('class Project', () => {
  let Model, Project, project;
  let data = readJSON('fixtures/project.json');

  beforeEach(module('heaterSiloM2M'));

  beforeEach(inject( (_Model_, _Project_) => {
    Model = _Model_;
    Project = _Project_;
    
    project = new Project(data);
  }));

  it('init', () => {
    expect(Project).toBeDefined();
  });

  it('should create instance of class Model', () => {

    expect(project instanceof Model).toBe(true);
  });

});