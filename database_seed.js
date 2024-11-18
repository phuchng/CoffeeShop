const mongoose = require('mongoose');

const uri = 'mongodb+srv://phuchng0612:VzYXbzn8SzZdEv5n@cluster0.q010e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

const Product = require('./models/Product');
const Account = require('./models/Account');

async function seedDatabase() {
  try {
    await Product.deleteMany({});
    await Account.deleteMany({});

    const products = [
    // Coffee Products
      {
        name: 'Coffee Cappuccino',
        image: 'menu-1.jpg',
        description: 'A rich and creamy coffee with a frothy top.',
        price: 5.9,
        category: "Coffee",
        servingOptions: ['Small', 'Medium', 'Large'],
      },
      {
        name: 'Coffee Latte',
        image: 'menu-2.jpg',
        description: 'A smooth blend of espresso and steamed milk.',
        price: 5.9,
        category: "Coffee",
        servingOptions: ['Small', 'Medium', 'Large'],
      },
    // Food Products
      {
        name: 'Grilled Beef',
        image: 'dish-1.jpg',
        description: 'Succulent grilled beef cooked to perfection.',
        price: 12.9,
        category: "Food",
        servingOptions: ['Rare', 'Medium', 'Well-done'],
      },

    // Drinks Products
      {
        name: 'Lemonade Juice',
        image: 'drink-1.jpg',
        description: 'Refreshing lemonade made from fresh lemons.',
        price: 2.9,
        category: "Drink",
        servingOptions: ['Medium', 'Large'],
      },
      {
        name: 'Pineapple Juice',
        image: 'drink-2.jpg',
        description: 'Refreshing pineapple juice made from fresh pineapples.',
        price: 2.9,
        category: "Drink",
        servingOptions: ['Medium', 'Large'],
      },
    // Desserts Products
      {
        name: 'Hot Cake Honey',
        image: 'dessert-1.jpg',
        description: 'Delicious hot cakes drizzled with honey.',
        price: 4.9,
        category: "Dessert",
        servingOptions: [],
      },
    ];

    await Product.insertMany(products);
    console.log('Products inserted');

    const accounts = [
      {
        username: 'quocthai',
        password: '123',
      },
      {
        username: 'thanhnhan',
        password: '456',
      },
    ];

    await Account.insertMany(accounts);
    console.log('Blogs inserted');

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
