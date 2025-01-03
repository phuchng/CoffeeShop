const mongoose = require('mongoose');
const { Product, Tag } = require('./models/Product');
const Account = require('./models/Account');
const Cart = require('./models/Cart')
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env' });

// Connect to MongoDB
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);

const productsData = [
    // Coffee
    {
        name: 'Ethiopian Yirgacheffe',
        image: 'menu-1.jpg',
        description: 'Bright, floral, and citrusy coffee from Ethiopia.',
        price: 18,
        category: 'Coffee',
        servingOptions: ['12 oz', '1 lb', '5 lb'],
        grind: 'Whole Bean',
        roast: 'Light',
        origin: 'Ethiopia',
        sales: 150,
        tag: '6662f8929459785498999999',
        ratings: {
            averageRating: 4.5,
            totalRatings: 6,
            allRatings: [
                {
                    user: '666300959459785498000001',
                    rating: 5,
                    review: 'This coffee is amazing! The floral notes are so refreshing.'
                },
                {
                    user: '666300959459785498000002',
                    rating: 4,
                    review: 'Good coffee, but a bit too light for my taste.'
                },
                {
                    user: '666300959459785498000003',
                    rating: 5,
                    review: 'Best coffee I have ever had! Highly recommend.'
                },
                {
                    user: '666300959459785498000004',
                    rating: 3,
                    review: 'It was okay. Expected a bit more flavor.'
                },
                {
                    user: '666300959459785498000005',
                    rating: 5,
                    review: 'Absolutely love this coffee! The citrusy notes are perfect.'
                },
                {
                    user: '666300959459785498000006',
                    rating: 4,
                    review: 'Great aroma and taste. Will buy again.'
                }
            ]
        }
    },
    {
        name: 'Sumatra Mandheling',
        image: 'menu-2.jpg',
        description: 'Earthy, full-bodied coffee with a smooth finish.',
        price: 16,
        category: 'Coffee',
        servingOptions: ['12 oz', '1 lb', '5 lb'],
        grind: 'Ground',
        roast: 'Dark',
        origin: 'Indonesia',
        sales: 120,
        tag: '6662f8929459785498999999',
        ratings: {
            averageRating: 4,
            totalRatings: 2,
            allRatings: [
                {
                    user: '666300959459785498000007',
                    rating: 4,
                    review: 'Love the earthy flavor of this coffee!'
                },
                {
                    user: '666300959459785498000008',
                    rating: 4,
                    review: 'A bit too strong for me, but still enjoyable.'
                }
            ]
        }
    },
    {
        name: 'Colombian Supremo',
        image: 'menu-3.jpg',
        description: 'Balanced and aromatic coffee with notes of caramel and nuts.',
        price: 14,
        category: 'Coffee',
        servingOptions: ['12 oz', '1 lb', '5 lb'],
        grind: 'Whole Bean',
        roast: 'Medium',
        origin: 'Colombia',
        sales: 200,
        tag: '6662f8929459785498999999',
        ratings: {
            averageRating: 5,
            totalRatings: 1,
            allRatings: [
                {
                    user: '666300959459785498000009',
                    rating: 5,
                    review: 'Perfectly balanced coffee. My new favorite!'
                }
            ]
        }
    },
    {
        name: 'Guatemalan Antigua',
        image: 'menu-4.jpg',
        description: 'Complex coffee with chocolate and spice undertones.',
        price: 15,
        category: 'Coffee',
        servingOptions: ['12 oz', '1 lb', '5 lb'],
        grind: 'Ground',
        roast: 'Medium',
        origin: 'Guatemala',
        sales: 100,
        tag: '6662f8929459785498999999',
        ratings: {
            averageRating: 3,
            totalRatings: 1,
            allRatings: [
                {
                    user: '666300959459785498000010',
                    rating: 3,
                    review: 'Interesting flavor, but not my favorite.'
                }
            ]
        }
    },
    {
        name: 'Brazilian Santos',
        image: 'menu-1.jpg',
        description: 'Mild and nutty coffee, perfect for everyday drinking.',
        price: 12,
        category: 'Coffee',
        servingOptions: ['12 oz', '1 lb', '5 lb'],
        grind: 'Whole Bean',
        roast: 'Light',
        origin: 'Brazil',
        sales: 180,
        tag: '6662f8929459785498999999',
        ratings: {
            averageRating: 4,
            totalRatings: 1,
            allRatings: [
                {
                    user: '666300959459785498000011',
                    rating: 4,
                    review: 'Great for everyday drinking. Smooth and mild.'
                }
            ]
        }
    },

    // Tea
    {
        name: 'Earl Grey',
        image: 'drink-5.jpg',
        description: 'Classic black tea infused with bergamot oil.',
        price: 8,
        category: 'Tea',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Black Tea', 'Bergamot Oil'],
        sales: 80,
        tag: '6662f8929459785498888888',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Green Tea Sencha',
        image: 'drink-7.jpg',
        description: 'Refreshing Japanese green tea with a vegetal flavor.',
        price: 10,
        category: 'Tea',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Green Tea'],
        sales: 90,
        tag: '6662f8929459785498888888',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Chamomile Tea',
        image: 'drink-4.jpg',
        description: 'Soothing herbal tea made from dried chamomile flowers.',
        price: 7,
        category: 'Tea',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Chamomile Flowers'],
        sales: 60,
        tag: '6662f8929459785498888888',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Peppermint Tea',
        image: 'drink-8.jpg',
        description: 'Invigorating herbal tea with a cool, minty taste.',
        price: 7,
        category: 'Tea',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Peppermint Leaves'],
        sales: 70,
        tag: '6662f8929459785498888888',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Rooibos Tea',
        image: 'drink-9.jpg',
        description: 'Naturally caffeine-free tea with a slightly sweet, nutty flavor.',
        price: 9,
        category: 'Tea',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Rooibos'],
        sales: 50,
        tag: '6662f8929459785498888888',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },

    // Food
    {
        name: 'Chocolate Croissant',
        image: 'dessert-6.jpg',
        description: 'Flaky pastry filled with rich, dark chocolate.',
        price: 4,
        category: 'Food',
        sales: 120,
        tag: '6662f8929459785498777777',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Blueberry Muffin',
        image: 'dessert-4.jpg',
        description: 'Moist muffin bursting with fresh blueberries.',
        price: 3.5,
        category: 'Food',
        sales: 100,
        tag: '6662f8929459785498777777',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Almond Biscotti',
        image: 'dessert-5.jpg',
        description: 'Crunchy Italian cookie, perfect for dipping in coffee.',
        price: 2.5,
        category: 'Food',
        sales: 80,
        tag: '6662f8929459785498777777',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Spinach and Feta Quiche',
        image: 'dessert-3.jpg',
        description: 'Savory pastry filled with spinach, feta cheese, and eggs.',
        price: 5,
        category: 'Food',
        sales: 60,
        tag: '6662f8929459785498777777',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Fruit Tart',
        image: 'dessert-1.jpg',
        description: 'Sweet pastry crust filled with fresh seasonal fruits and custard.',
        price: 6,
        category: 'Food',
        sales: 70,
        tag: '6662f8929459785498777777',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },

    // Juice
    {
        name: 'Fresh Orange Juice',
        image: 'drink-1.jpg',
        description: '100% pure, freshly squeezed orange juice.',
        price: 5,
        category: 'Juice',
        sales: 150,
        tag: '6662f8929459785498666666',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Green Detox Smoothie',
        image: 'drink-7.jpg',
        description: 'Blend of spinach, kale, cucumber, green apple, and lemon.',
        price: 7,
        category: 'Juice',
        sales: 120,
        tag: '6662f8929459785498666666',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Carrot Ginger Juice',
        image: 'drink-8.jpg',
        description: 'Invigorating mix of fresh carrot juice with a hint of ginger.',
        price: 6,
        category: 'Juice',
        sales: 90,
        tag: '6662f8929459785498666666',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Berry Blast Smoothie',
        image: 'drink-9.jpg',
        description: 'Mix of strawberries, blueberries, raspberries, and banana.',
        price: 7,
        category: 'Juice',
        sales: 110,
        tag: '6662f8929459785498666666',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        name: 'Tropical Mango Smoothie',
        image: 'drink-1.jpg',
        description: 'Creamy blend of mango, pineapple, and coconut milk.',
        price: 7,
        category: 'Juice',
        sales: 100,
        tag: '6662f8929459785498666666',
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    }
];

const tagsData = [
    {
        _id: '6662f8929459785498999999',
        tag: 'Coffee',
        category: 'Coffee'
    },
    {
        _id: '6662f8929459785498888888',
        tag: 'Tea',
        category: 'Tea'
    },
    {
        _id: '6662f8929459785498777777',
        tag: 'Food',
        category: 'Food'
    },
    {
        _id: '6662f8929459785498666666',
        tag: 'Juice',
        category: 'Juice'
    }
]

const usersData = [];
for (let i = 1; i <= 20; i++) {
    const user = {
        _id: `6663009594597854980000${String(i).padStart(2, '0')}`,
        first_name: `User${i}`,
        last_name: `Test${i}`,
        email: `user${i}@example.com`,
        password: `password${i}`, // This will be hashed later
        role: 'user',
        address: {
            first_name: `AddressFName${i}`,
            last_name: `AddressLName${i}`,
            company: `Company${i}`,
            address: `${i} Main St`,
            apartment: `Apt ${i}`,
            phone: `555-123-${1000 + i}`,
            isDefault: i === 1, // Make the first user's address default
        },
        isVerified: true
    };
    usersData.push(user);
}

async function addMockData() {
    try {
        // Add Tags
        await Tag.deleteMany({});
        await Tag.insertMany(tagsData);
        console.log('Tags added successfully!');

        // Add Products
        await Product.deleteMany({});
        await Product.insertMany(productsData);
        console.log('Products added successfully!');

        // Hash passwords and add users
        await Account.deleteMany({});
        for (const user of usersData) {
            if (!user.password) {
                user.google = {
                    id: user._id,
                    email: user.email,
                };
            } else {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
            const newUser = new Account(user);
            await newUser.save();
        }
        console.log('Users added successfully!');

        // Add Admin Account
        const existingAdmin = await Account.findOne({ email: 'admin@gmail.com' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('password1234', 10);
            const adminAccount = new Account({
                first_name: 'Admin',
                last_name: 'User',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminAccount.save();
            console.log('Admin account added successfully!');
        } else {
            console.log('Admin account already exists.');
        }

        await Cart.deleteMany({});
    } catch (error) {
        console.error('Error adding data:', error);
    } finally {
        mongoose.disconnect();
    }
}

addMockData();