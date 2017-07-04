describe('userService', function() {
  var userService;

  beforeEach(module('heaterSiloM2M'));

  beforeEach(inject(_userService_ => {
    userService = _userService_;
  }));

  it('init', () => {
    expect(userService).toBeDefined();
  });

  it('check token', () => {
    let token = '123aaa';
    userService.saveToken(token);

    expect(userService.getToken()).toBe(token);
  });
});