const { Product, Tag } = require('../models/Product');

const fetchCoffeeTagsAndProducts = async (req, res, next) => {
    try {
        const coffeeTags = await Tag.find({ category: 'Coffee' }).lean();
        const teaTags = await Tag.find({ category: 'Tea' }).lean();
        const foodTags = await Tag.find({ category: 'Food' }).lean();
        const juiceTags = await Tag.find({ category: 'Juice' }).lean();

        const getProductsByTag = async (tagId, category) => {
            return await Product.aggregate([
              { $match: { tag: tagId, category: category } }, // Match products with this tag
              { $sample: { size: 6 } }   // Randomly sample 6 products
            ]);
          };

        const coffee = await Promise.all(
          coffeeTags.map(async (tag) => {
            const products = await getProductsByTag(tag._id, 'coffee');
            return { tag: tag.tag, products };
          })
        );

        const tea = await Promise.all(
          teaTags.map(async (tag) => {
            const products = await getProductsByTag(tag._id, 'tea');
            return { tag: tag.tag, products };
          })
        );

        const food = await Promise.all(
          foodTags.map(async (tag) => {
            const products = await getProductsByTag(tag._id, 'food');
            return { tag: tag.tag, products };
          })
        );

        const juice = await Promise.all(
          juiceTags.map(async (tag) => {
            const products = await getProductsByTag(tag._id, 'juice');
            return { tag: tag.tag, products };
          })
        );
        
        res.locals.categories = { coffee, tea, food, juice };
        next();
    }catch(err){
        console.error(err);
        next(err);
    }
};

module.exports = fetchCoffeeTagsAndProducts;