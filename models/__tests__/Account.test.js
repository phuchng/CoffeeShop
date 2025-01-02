const Account = require('../Account');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('Account Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Account.deleteMany({});
  });

  it('should create a new user account', async () => {
    const account = new Account({
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    const savedAccount = await account.save();

    expect(savedAccount._id).toBeDefined();
    expect(savedAccount.first_name).toBe('Test');
    expect(savedAccount.last_name).toBe('User');
    expect(savedAccount.email).toBe('testuser@example.com');
    expect(savedAccount.role).toBe('user'); // Default role
    expect(await bcrypt.compare('password123', savedAccount.password)).toBe(
      true
    );
  });

  it('should create a new admin account', async () => {
    const account = new Account({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin',
    });
    const savedAccount = await account.save();

    expect(savedAccount._id).toBeDefined();
    expect(savedAccount.role).toBe('admin');
  });
});