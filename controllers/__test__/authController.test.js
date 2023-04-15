const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('../authController.js');

describe('checkAuthenticated', () => {
  it('should call next if user is authenticated', () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(true),
    };
    const res = {};
    const next = jest.fn();
    checkAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it('should redirect to login if user is not authenticated', () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(false),
    };
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    checkAuthenticated(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });
});

describe('checkNotAuthenticated', () => {
  it('should call next if user is not authenticated', () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(false),
    };
    const res = {};
    const next = jest.fn();
    checkNotAuthenticated(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it('should redirect to / if user is authenticated', () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(true),
    };
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    checkNotAuthenticated(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});
