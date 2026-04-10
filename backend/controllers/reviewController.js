const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { productId, rating, comment, media, mediaType } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            comment,
            media,
            mediaType: mediaType || (media ? 'image' : 'none')
        });

        res.status(201).json(review);
    } catch (error) {
        console.error("Review Error:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to add review' });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name profileImage')
            .sort('-createdAt');

        res.json(reviews);
    } catch (error) {
        console.error("Review Fetch Error:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to fetch reviews' });
    }
};
