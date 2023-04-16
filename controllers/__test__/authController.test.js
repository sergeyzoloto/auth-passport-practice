const {
  checkAuthenticated,
  checkNotAuthenticated,
  addNewUser,
} = require('../authController.js');

const bcrypt = require('bcrypt');
const User = require('../../models/User');

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

// Mock the request and response objects for testing
const req = {
  body: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password',
  },
};
const res = {
  redirect: jest.fn(),
};

// Mock the bcrypt.hash function for testing
jest.mock('bcrypt', () => ({
  hash: jest.fn(() =>
    Promise.resolve(
      '$2a$10$KJKOQ2KxJh/i1lOQu/Ucu.ybUEppRuCX54jnMKMAI7VQYnAnfzCma',
    ),
  ),
}));

// Mock the User model for testing
jest.mock('../../models/User');

describe('addNewUser', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks after each test
  });

  test('should create a new user with hashed password and redirect to /login on success', async () => {
    // Call the addNewUser function
    await addNewUser(req, res);

    // Check if bcrypt.hash is called with the correct arguments
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);

    // Check if a new User instance is created with the correct data
    expect(User).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '$2a$10$KJKOQ2KxJh/i1lOQu/Ucu.ybUEppRuCX54jnMKMAI7VQYnAnfzCma',
    });

    // Check if User.prototype.save is called
    expect(User.prototype.save).toHaveBeenCalled();

    // Check if res.redirect is called with the correct argument
    expect(res.redirect).toHaveBeenCalledWith('/login');
  });

  test('should redirect to /register on error', async () => {
    // Mock bcrypt.hash to throw an error
    bcrypt.hash.mockRejectedValue(new Error('Failed to hash password'));

    // Call the addNewUser function
    await addNewUser(req, res);

    // Check if res.redirect is called with the correct argument
    expect(res.redirect).toHaveBeenCalledWith('/register');
  });
});
