const request = require('supertest');
const app = require('../../app');
const Account = require('../../models/Account');
const mongoose = require('mongoose');
const { Product, Tag } = require('../../models/Product');
const bcrypt = require('bcrypt');

describe('Admin Route Tests', () => {
  let agent;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    // Clear data before each test
    await Product.deleteMany({});
    await Tag.deleteMany({});
    await Account.deleteMany({});
  
    // Create an admin user for testing
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await Account.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
  
    // Create a new agent before each test
    agent = request.agent(app);
  
    // Log in the admin user and wait for it to complete
    const loginResponse = await agent
      .post('/login')
      .send({ email: 'admin@example.com', password: 'adminpassword' });
  
    // Check if login was successful
    expect(loginResponse.statusCode).toBe(302);
    expect(loginResponse.headers.location).toBe('/admin/dashboard');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /admin/dashboard should be accessible to admins', async () => {
    const response = await agent.get('/admin/dashboard');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('General Statistics');
  });

  it('GET /admin/dashboard should be restricted to non-admins', async () => {
      const nonAdminAgent = request.agent(app);
    const response = await nonAdminAgent.get('/admin/dashboard');

    expect(response.statusCode).toBe(403); // Expect a 403 Forbidden error
  });

  it('GET /admin/products should return the products page for admins', async () => {
    const response = await agent.get('/admin/products');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Products');
  });

  it('POST /admin/products/add should add a new product', async () => {
    const tag = await Tag.create({ tag: 'Test Tag', category: 'Coffee' });
    const productData = {
      name: 'New Test Product',
      price: 10.99,
      description: 'A new test product',
      category: 'Coffee',
      tag: tag._id,
      servingOptions: '12 oz, 1 lb',
      grind: 'Whole Bean',
      roast: 'Medium',
      origin: 'Test Origin',
      ingredients: 'Ingredient 1, Ingredient 2',
    };

    const response = await agent.post('/admin/products/add').send(productData);

    expect(response.statusCode).toBe(200); // Expect a JSON response
    expect(response.body.message).toBe('Product added successfully!');

    const newProduct = await Product.findOne({ name: 'New Test Product' });
    expect(newProduct).not.toBeNull();
    expect(newProduct.price).toBe(10.99);
  });
});