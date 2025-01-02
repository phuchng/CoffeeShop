const { Product, Tag } = require('../Product');
const mongoose = require('mongoose');

describe('Product Model Tests', () => {
  beforeAll(async () => {
    // Connect to the in-memory database before running tests
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    // Disconnect from the database after running tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Product.deleteMany({});
    await Tag.deleteMany({});
  });

  it('should create a new product', async () => {
    const tag = new Tag({ tag: 'Coffee', category: 'Coffee' });
    await tag.save();

    const product = new Product({
      name: 'Test Coffee',
      price: 5.99,
      description: 'A delicious test coffee',
      category: 'Coffee',
      tag: tag._id,
    });
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe('Test Coffee');
    expect(savedProduct.price).toBe(5.99);
    expect(savedProduct.description).toBe('A delicious test coffee');
    expect(savedProduct.category).toBe('Coffee');
    expect(savedProduct.tag).toEqual(tag._id);
  });

  it('should update product ratings correctly', async () => {
    const product = new Product({
      name: 'Test Coffee',
      price: 5.99,
      category: 'Coffee',
    });
    await product.save();

    product.ratings.allRatings.push(4, 5, 3);
    product.updateRatings();
    await product.save();

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.ratings.totalRatings).toBe(3);
    expect(updatedProduct.ratings.averageRating).toBe(4);
  });
});