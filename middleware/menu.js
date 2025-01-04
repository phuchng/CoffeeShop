// middleware/menu.js
const { Product } = require('../models/Product');
const Category = require('../models/Category');

const fetchCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).lean();

        const categoriesWithProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.aggregate([
                    { $match: { category: category._id } },
                    { $sample: { size: 6 } }
                ]);
                return { name: category.name, products };
            })
        );

        res.locals.categories = categoriesWithProducts;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = fetchCategories;