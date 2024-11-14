const mongoose = require('mongoose');

const uri = 'mongodb+srv://phuchng0612:VzYXbzn8SzZdEv5n@cluster0.q010e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

const Category = require('./models/Category');
const Product = require('./models/Product');
const Blog = require('./models/Blog');

async function seedDatabase() {
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});

    const coffeeCategory = new Category({
      name: 'Coffee',
      image: '/images/img-1.png',
      description: 'Selling the best coffee to your likings!',
    });

    const foodCategory = new Category({
      name: 'Food',
      image: '/images/img-2.png',
      description: "Hungry for some? Just tell me what you'd like to eat!",
    });

    const drinksCategory = new Category({
      name: 'Drinks',
      image: '/images/img-3.png',
      description: 'We sell more than just coffee here!',
    });

    const dessertsCategory = new Category({
      name: 'Desserts',
      image: '/images/img-4.png',
      description: 'If you want to have something to go with your drinks',
    });

    const categories = [coffeeCategory, foodCategory, drinksCategory, dessertsCategory];

    await Category.insertMany(categories);
    console.log('Categories inserted');

    const products = [
    // Coffee Products
      {
        name: 'Coffee Cappuccino',
        image: '/images/menu-1.jpg',
        description: 'A rich and creamy coffee with a frothy top.',
        price: 5.9,
        category: coffeeCategory._id,
        servingOptions: ['Small', 'Medium', 'Large'],
      },
      {
        name: 'Coffee Latte',
        image: '/images/menu-2.jpg',
        description: 'A smooth blend of espresso and steamed milk.',
        price: 5.9,
        category: coffeeCategory._id,
        servingOptions: ['Small', 'Medium', 'Large'],
      },
    // Food Products
      {
        name: 'Grilled Beef',
        image: '/images/dish-1.jpg',
        description: 'Succulent grilled beef cooked to perfection.',
        price: 12.9,
        category: foodCategory._id,
        servingOptions: ['Rare', 'Medium', 'Well-done'],
      },

    // Drinks Products
      {
        name: 'Lemonade Juice',
        image: '/images/drink-1.jpg',
        description: 'Refreshing lemonade made from fresh lemons.',
        price: 2.9,
        category: drinksCategory._id,
        servingOptions: ['Medium', 'Large'],
      },
      {
        name: 'Pineapple Juice',
        image: '/images/drink-2.jpg',
        description: 'Refreshing pineapple juice made from fresh pineapples.',
        price: 2.9,
        category: drinksCategory._id,
        servingOptions: ['Medium', 'Large'],
      },
    // Desserts Products
      {
        name: 'Hot Cake Honey',
        image: '/images/dessert-1.jpg',
        description: 'Delicious hot cakes drizzled with honey.',
        price: 4.9,
        category: dessertsCategory._id,
        servingOptions: [],
      },
    ];

    await Product.insertMany(products);
    console.log('Products inserted');

    const blogs = [
      {
        title: 'PREP TECHNIQUES Coffee',
        image: '/images/blog-img1.png',
        date: new Date('2023-04-05'),
        content:
          'Discover various coffee preparation techniques that bring out unique flavors.',
      },
      {
        title: 'Enjoy Best Coffee',
        image: '/images/blog-img2.png',
        date: new Date('2023-04-05'),
        content:
          'Learn how to enjoy the best coffee experiences at our shop.',
      },
    ];

    await Blog.insertMany(blogs);
    console.log('Blogs inserted');

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
