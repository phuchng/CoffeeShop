const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: String, // URL or path to the main image
    images: [String], // Array of URLs or paths to the images
    description: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category model
    servingOptions: [String],
    grind: { type: String, enum: ['Whole Bean', 'Ground'] },
    roast: { type: String, enum: ['Light', 'Medium', 'Dark'] },
    origin: String,
    ratings: {
        averageRating: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        allRatings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Account'
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5
                },
                review: {
                    type: String
                }
            }
        ]
    },
    ingredients: [String],
    sales: { type: Number, default: 0 },
    status: { type: String, enum: ['On stock', 'Out of stock', 'Suspended'], default: 'On stock' }
}, { timestamps: true });

ProductSchema.methods.updateRatings = function () {
    const totalRatings = this.ratings.allRatings.length;
    const averageRating = totalRatings
        ? this.ratings.allRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
        : 0;

    this.ratings.totalRatings = totalRatings;
    this.ratings.averageRating = averageRating.toFixed(2); // Keep it to 2 decimal places
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = {
    Product
};