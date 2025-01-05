const mongoose = require('mongoose');
const { Product } = require('./models/Product');
const Account = require('./models/Account');
const Cart = require('./models/Cart');
const Category = require('./models/Category');
const Order = require('./models/Order');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env' });

// Connect to MongoDB
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);

const productsData = [
    // Coffee
    {
        _id: '666300959459785498000026', // Added _id field
        name: 'Ethiopian Yirgacheffe',
        image: 'menu-1.jpg',
        images: ['menu-1.jpg', 'menu-2.jpg', 'menu-3.jpg'],
        description: 'Bright, floral, and citrusy coffee from Ethiopia.',
        price: 18,
        category: '666300959459785498000021',
        servingOptions: ['S', 'M', 'L'],
        grind: 'Whole Bean',
        roast: 'Light',
        origin: 'Ethiopia',
        sales: 150,
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
        _id: '666300959459785498000027', // Added _id field
        name: 'Sumatra Mandheling',
        image: 'menu-2.jpg',
        images: ['menu-2.jpg', 'menu-3.jpg', 'menu-4.jpg'],
        description: 'Earthy, full-bodied coffee with a smooth finish.',
        price: 16,
        category: '666300959459785498000021',
        servingOptions: ['S', 'M', 'L'],
        grind: 'Ground',
        roast: 'Dark',
        origin: 'Indonesia',
        sales: 120,
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
        _id: '666300959459785498000028', // Added _id field
        name: 'Colombian Supremo',
        image: 'menu-3.jpg',
        images: ['menu-3.jpg', 'menu-4.jpg', 'menu-1.jpg'],
        description: 'Balanced and aromatic coffee with notes of caramel and nuts.',
        price: 14,
        category: '666300959459785498000021',
        servingOptions: ['S', 'M', 'L'],
        grind: 'Whole Bean',
        roast: 'Medium',
        origin: 'Colombia',
        sales: 200,
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
        _id: '666300959459785498000029', // Added _id field
        name: 'Guatemalan Antigua',
        image: 'menu-4.jpg',
        images: ['menu-4.jpg', 'menu-1.jpg', 'menu-2.jpg'],
        description: 'Complex coffee with chocolate and spice undertones.',
        price: 15,
        category: '666300959459785498000021',
        servingOptions: ['S', 'M', 'L'],
        grind: 'Ground',
        roast: 'Medium',
        origin: 'Guatemala',
        sales: 100,
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
        _id: '666300959459785498000030', // Added _id field
        name: 'Brazilian Santos',
        image: 'menu-1.jpg',
        images: ['menu-1.jpg', 'menu-2.jpg', 'menu-3.jpg'],
        description: 'Mild and nutty coffee, perfect for everyday drinking.',
        price: 12,
        category: '666300959459785498000021',
        servingOptions: ['S', 'M', 'L'],
        grind: 'Whole Bean',
        roast: 'Light',
        origin: 'Brazil',
        sales: 180,
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
        _id: '666300959459785498000031', // Added _id field
        name: 'Earl Grey',
        image: 'drink-5.jpg',
        images: ['drink-5.jpg', 'drink-6.jpg', 'drink-7.jpg'],
        description: 'Classic black tea infused with bergamot oil.',
        price: 8,
        category: '666300959459785498000022',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Black Tea', 'Bergamot Oil'],
        sales: 80,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000032', // Added _id field
        name: 'Green Tea Sencha',
        image: 'drink-7.jpg',
        images: ['drink-7.jpg', 'drink-8.jpg', 'drink-9.jpg'],
        description: 'Refreshing Japanese green tea with a vegetal flavor.',
        price: 10,
        category: '666300959459785498000022',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Green Tea'],
        sales: 90,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000033', // Added _id field
        name: 'Chamomile Tea',
        image: 'drink-4.jpg',
        images: ['drink-4.jpg', 'drink-5.jpg', 'drink-6.jpg'],
        description: 'Soothing herbal tea made from dried chamomile flowers.',
        price: 7,
        category: '666300959459785498000022',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Chamomile Flowers'],
        sales: 60,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000034', // Added _id field
        name: 'Peppermint Tea',
        image: 'drink-8.jpg',
        images: ['drink-8.jpg', 'drink-9.jpg', 'drink-7.jpg'],
        description: 'Invigorating herbal tea with a cool, minty taste.',
        price: 7,
        category: '666300959459785498000022',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Peppermint Leaves'],
        sales: 70,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000035', // Added _id field
        name: 'Rooibos Tea',
        image: 'drink-9.jpg',
        images: ['drink-9.jpg', 'drink-8.jpg', 'drink-7.jpg'],
        description: 'Naturally caffeine-free tea with a slightly sweet, nutty flavor.',
        price: 9,
        category: '666300959459785498000022',
        servingOptions: ['Loose Leaf', 'Tea Bags'],
        ingredients: ['Rooibos'],
        sales: 50,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },

    // Food
    {
        _id: '666300959459785498000036', // Added _id field
        name: 'Chocolate Croissant',
        image: 'dessert-6.jpg',
        images: ['dessert-6.jpg', 'dessert-5.jpg', 'dessert-4.jpg'],
        description: 'Flaky pastry filled with rich, dark chocolate.',
        servingOptions: ['Hot'],
        price: 4,
        category: '666300959459785498000023',
        sales: 120,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000037', // Added _id field
        name: 'Blueberry Muffin',
        image: 'dessert-4.jpg',
        images: ['dessert-4.jpg', 'dessert-3.jpg', 'dessert-2.jpg'],
        description: 'Moist muffin bursting with fresh blueberries.',
        servingOptions: ['Hot'],
        price: 3.5,
        category: '666300959459785498000023',
        sales: 100,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000038', // Added _id field
        name: 'Almond Biscotti',
        image: 'dessert-5.jpg',
        images: ['dessert-5.jpg', 'dessert-4.jpg', 'dessert-3.jpg'],
        description: 'Crunchy Italian cookie, perfect for dipping in coffee.',
        servingOptions: ['Hot'],
        price: 2.5,
        category: '666300959459785498000023',
        sales: 80,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000039', // Added _id field
        name: 'Spinach and Feta Quiche',
        image: 'dessert-3.jpg',
        images: ['dessert-3.jpg', 'dessert-2.jpg', 'dessert-1.jpg'],
        description: 'Savory pastry filled with spinach, feta cheese, and eggs.',
        servingOptions: ['Hot'],
        price: 5,
        category: '666300959459785498000023',
        sales: 60,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000040', // Added _id field
        name: 'Fruit Tart',
        image: 'dessert-1.jpg',
        images: ['dessert-1.jpg', 'dessert-2.jpg', 'dessert-3.jpg'],
        description: 'Sweet pastry crust filled with fresh seasonal fruits and custard.',
        servingOptions: ['Hot'],
        price: 6,
        category: '666300959459785498000023',
        sales: 70,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },

    // Juice
    {
        _id: '666300959459785498000041', // Added _id field
        name: 'Fresh Orange Juice',
        image: 'drink-1.jpg',
        images: ['drink-1.jpg', 'drink-2.jpg', 'drink-3.jpg'],
        description: '100% pure, freshly squeezed orange juice.',
        servingOptions: ['S', 'M', 'L'],
        price: 5,
        category: '666300959459785498000024',
        sales: 150,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000042', // Added _id field
        name: 'Green Detox Smoothie',
        image: 'drink-7.jpg',
        images: ['drink-7.jpg', 'drink-8.jpg', 'drink-9.jpg'],
        description: 'Blend of spinach, kale, cucumber, green apple, and lemon.',
        servingOptions: ['S', 'M', 'L'],
        price: 7,
        category: '666300959459785498000024',
        sales: 120,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000043', // Added _id field
        name: 'Carrot Ginger Juice',
        image: 'drink-8.jpg',
        images: ['drink-8.jpg', 'drink-9.jpg', 'drink-7.jpg'],
        description: 'Invigorating mix of fresh carrot juice with a hint of ginger.',
        servingOptions: ['S', 'M', 'L'],
        price: 6,
        category: '666300959459785498000024',
        sales: 90,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000044', // Added _id field
        name: 'Berry Blast Smoothie',
        image: 'drink-9.jpg',
        images: ['drink-9.jpg', 'drink-8.jpg', 'drink-7.jpg'],
        description: 'Mix of strawberries, blueberries, raspberries, and banana.',
        servingOptions: ['S', 'M', 'L'],
        price: 7,
        category: '666300959459785498000024',
        sales: 110,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    },
    {
        _id: '666300959459785498000045', // Added _id field
        name: 'Tropical Mango Smoothie',
        image: 'drink-1.jpg',
        images: ['drink-1.jpg', 'drink-2.jpg', 'drink-3.jpg'],
        description: 'Creamy blend of mango, pineapple, and coconut milk.',
        servingOptions: ['S', 'M', 'L'],
        price: 7,
        category: '666300959459785498000024',
        sales: 100,
        ratings: {
            averageRating: 0,
            totalRatings: 0,
            allRatings: []
        }
    }
];


const categoriesData = [
    {
        _id: '666300959459785498000021',
        name: 'Coffee',
        description: 'Ground and whole bean coffee from around the world.',
        subcategories: ['Ethiopian Yirgacheffe', 'Sumatra Mandheling', 'Colombian Supremo', 'Guatemalan Antigua', 'Brazilian Santos']
    },
    {
        _id: '666300959459785498000022',
        name: 'Tea',
        description: 'Loose leaf and bagged teas.',
        subcategories: ['Earl Grey', 'Green Tea Sencha', 'Chamomile Tea', 'Peppermint Tea', 'Rooibos Tea']
    },
    {
        _id: '666300959459785498000023',
        name: 'Food',
        description: 'Pastries, sandwiches, and other food items.',
        subcategories: ['Chocolate Croissant', 'Blueberry Muffin', 'Almond Biscotti', 'Spinach and Feta Quiche', 'Fruit Tart']
    },
    {
        _id: '666300959459785498000024',
        name: 'Juice',
        description: 'Freshly squeezed juices and smoothies.',
        subcategories: ['Fresh Orange Juice', 'Green Detox Smoothie', 'Carrot Ginger Juice', 'Berry Blast Smoothie', 'Tropical Mango Smoothie']
    }
];

const usersData = [];
for (let i = 1; i <= 20; i++) {
    const user = {
        _id: `6663009594597854980000${String(i).padStart(2, '0')}`,
        first_name: `Coffee`,
        last_name: `Drinker ${i}`,
        email: `user${i}@example.com`,
        password: `password${i}`, // This will be hashed later
        role: 'user',
        address: {
            first_name: `Coffee`,
            last_name: `Drinker ${i}`,
            company: `Company ${i}`,
            address: `${i} Main St`,
            apartment: `Apt ${i}`,
            phone: `555-123-${1000 + i}`,
            isDefault: i === 1, // Make the first user's address default
        },
        isVerified: true
    };
    usersData.push(user);
}

const ordersData = [
    {
        account: '666300959459785498000001',
        products: [
            { product: '666300959459785498000026', quantity: 2, servingOption: 'S' },
            { product: '666300959459785498000027', quantity: 1, servingOption: 'M' }
        ],
        address: usersData[0].address, // Use address from Coffee Drinker 1
        totalPrice: 52,
        totalItems: 3,
        orderDate: new Date('2025-01-04'),
        shipTime: new Date('2025-01-05'),
        status: 'processing'
    },
    {
        account: '666300959459785498000002',
        products: [
            { product: '666300959459785498000028', quantity: 3, servingOption: 'L' }
        ],
        address: usersData[1].address, // Use address from Coffee Drinker 2
        totalPrice: 42,
        totalItems: 3,
        orderDate: new Date('2025-01-03'),
        shipTime: new Date('2025-01-04'),
        status: 'pending'
    },
    {
        account: '666300959459785498000003',
        products: [
            { product: '666300959459785498000029', quantity: 1, servingOption: 'S' },
            { product: '666300959459785498000030', quantity: 2, servingOption: 'M' }
        ],
        address: usersData[2].address, // Use address from Coffee Drinker 3
        totalPrice: 44,
        totalItems: 3,
        orderDate: new Date('2024-12-15'),
        shipTime: new Date('2024-12-16'),
        status: 'completed'
    },
    {
        account: '666300959459785498000004',
        products: [
            { product: '666300959459785498000031', quantity: 4, servingOption: 'L' }
        ],
        address: usersData[3].address, // Use address from Coffee Drinker 4
        totalPrice: 32,
        totalItems: 4,
        orderDate: new Date('2024-11-20'),
        shipTime: new Date('2024-11-21'),
        status: 'completed'
    },
    {
        account: '666300959459785498000005',
        products: [
            { product: '666300959459785498000032', quantity: 1, servingOption: 'S' },
            { product: '666300959459785498000033', quantity: 1, servingOption: 'M' },
            { product: '666300959459785498000034', quantity: 1, servingOption: 'L' }
        ],
        address: usersData[4].address, // Use address from Coffee Drinker 5
        totalPrice: 23,
        totalItems: 3,
        orderDate: new Date('2024-10-10'),
        shipTime: new Date('2024-10-11'),
        status: 'completed'
    },
    {
        account: '666300959459785498000006',
        products: [
            { product: '666300959459785498000035', quantity: 2, servingOption: 'M' }
        ],
        address: usersData[5].address, // Use address from Coffee Drinker 6
        totalPrice: 18,
        totalItems: 2,
        orderDate: new Date('2024-09-15'),
        shipTime: new Date('2024-09-16'),
        status: 'completed'
    },
    {
        account: '666300959459785498000007',
        products: [
            { product: '666300959459785498000037', quantity: 3, servingOption: 'L' }
        ],
        address: usersData[6].address, // Use address from Coffee Drinker 7
        totalPrice: 10.5,
        totalItems: 3,
        orderDate: new Date('2024-08-05'),
        shipTime: new Date('2024-08-06'),
        status: 'completed'
    },
    {
        account: '666300959459785498000008',
        products: [
            { product: '666300959459785498000038', quantity: 1, servingOption: 'S' },
            { product: '666300959459785498000039', quantity: 1, servingOption: 'M' }
        ],
        address: usersData[7].address, // Use address from Coffee Drinker 8
        totalPrice: 7.5,
        totalItems: 2,
        orderDate: new Date('2024-07-15'),
        shipTime: new Date('2024-07-16'),
        status: 'cancelled'
    },
    {
        account: '666300959459785498000009',
        products: [
            { product: '666300959459785498000040', quantity: 2, servingOption: 'M' }
        ],
        address: usersData[8].address, // Use address from Coffee Drinker 9
        totalPrice: 12,
        totalItems: 2,
        orderDate: new Date('2024-05-05'),
        shipTime: new Date('2024-05-06'),
        status: 'completed'
    },
    {
        account: '666300959459785498000010',
        products: [
            { product: '666300959459785498000021', quantity: 5, servingOption: 'L' }
        ],
        address: usersData[9].address, // Use address from Coffee Drinker 10
        totalPrice: 30,
        totalItems: 5,
        orderDate: new Date('2024-03-10'),
        shipTime: new Date('2024-03-11'),
        status: 'completed'
    },
    {
        account: '666300959459785498000011',
        products: [
            { product: '666300959459785498000022', quantity: 2, servingOption: 'S' },
            { product: '666300959459785498000023', quantity: 1, servingOption: 'M' },
            { product: '666300959459785498000024', quantity: 3, servingOption: 'L' }
        ],
        address: usersData[10].address, // Use address from Coffee Drinker 11
        totalPrice: 50,
        totalItems: 6,
        orderDate: new Date('2024-01-15'),
        shipTime: new Date('2024-01-16'),
        status: 'cancelled'
    }
];

async function addMockData() {
    try {
        // Add Categories
        await Category.deleteMany({});
        await Category.insertMany(categoriesData);
        console.log('Categories added successfully!');

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
        console.log('Users email: user1@example.com, ..., user20@example.com');
        console.log('Users password: password1, ..., password20');

        // Add Admin Account
        const hashedPassword = await bcrypt.hash('password1', 10);
        const adminAccount = new Account({
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });
        await adminAccount.save();
        console.log('Admin account added successfully!');
        console.log('Admin account email: admin@example.com');
        console.log('Admin account password: password1');


        await Cart.deleteMany({});

        // Add Orders
        await Order.deleteMany({});
        await Order.insertMany(ordersData);
        console.log('Orders added successfully!');
    } catch (error) {
        console.error('Error adding data:', error);
    } finally {
        mongoose.disconnect();
    }
}

addMockData();