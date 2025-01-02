const request = require('supertest');
const app = require('../../app'); // Import your Express app
const { Product, Tag } = require('../../models/Product');
const mongoose = require('mongoose');

describe('Index Route Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Tag.deleteMany({});
  });

  it('GET / should return the homepage with products', async () => {
    // Create some test products
    const tag = await Tag.create({ tag: 'Coffee', category: 'Coffee' });
    await Product.create({
      name: 'Test Product 1',
      price: 9.99,
      category: 'Coffee',
      tag: tag._id,
    });
    await Product.create({
      name: 'Test Product 2',
      price: 12.99,
      category: 'Coffee',
      tag: tag._id,
    });

    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Test Product 1');
    expect(response.text).toContain('Test Product 2');
  });

  it('GET /products should return the products page', async () => {
    const response = await request(app).get('/products');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('All Products');
  });
});