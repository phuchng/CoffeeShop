const request = require('supertest');
const app = require('../../app');
const Account = require('../../models/Account');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('Authentication Route Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Account.deleteMany({});
  });

  it('POST /register should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'testauth@example.com',
        password: 'password123',
        passwordAgain: 'password123',
      });

    expect(response.statusCode).toBe(200); // Expect a redirect after successful registration

    const user = await Account.findOne({ email: 'testauth@example.com' });
    expect(user).not.toBeNull();
    expect(user.first_name).toBe('Test');
  });

  it('POST /login should log in an existing user', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'testauth@example.com',
      password: hashedPassword,
    });

    const response = await request(app)
      .post('/login')
      .send({ email: 'testauth@example.com', password: password });

    expect(response.statusCode).toBe(302); // Expect a redirect after successful login
    expect(response.headers.location).toBe('/'); // Redirect to homepage for users
  });
});