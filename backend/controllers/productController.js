const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            productName: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const products = await Product.find({ ...keyword, ...category }).populate('vendorId', 'vendorName profileImage location');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error retrieving products' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendorId', 'vendorName profileImage description location address');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error retrieving product' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
exports.createProduct = async (req, res) => {
    try {
        const { productName, description, price, category, images, stock } = req.body;

        console.log("Creating product for user:", req.user._id);

        const Vendor = require('../models/Vendor');
        // Find the vendor profile linked to this user
        const vendorProfile = await Vendor.findOne({ user_id: req.user._id });

        if (!vendorProfile) {
            console.error("Vendor profile not found for user_id:", req.user._id);
            return res.status(404).json({ message: 'Vendor profile not found. Please register as a vendor first.' });
        }

        console.log("Found vendor profile:", vendorProfile._id, "for user:", req.user.email);

        const product = new Product({
            productName,
            description,
            price,
            category,
            images,
            stock,
            vendorId: vendorProfile._id
        });

        const createdProduct = await product.save();
        console.log("Product created successfully:", createdProduct._id);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: 'Server Error: Failed to create product' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
exports.updateProduct = async (req, res) => {
    try {
        const { productName, description, price, category, images, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const Vendor = require('../models/Vendor');
            const vendorProfile = await Vendor.findOne({ user_id: req.user._id });

            if (!vendorProfile || (product.vendorId.toString() !== vendorProfile._id.toString() && req.user.role !== 'admin')) {
                console.warn(`Unauthorized update attempt on product ${product._id} by user ${req.user.email}`);
                return res.status(401).json({ message: 'Not authorized to update this product' });
            }

            product.productName = productName || product.productName;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.category = category || product.category;
            product.images = images || product.images;
            product.stock = stock !== undefined ? stock : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating product' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor or Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const Vendor = require('../models/Vendor');
            const vendorProfile = await Vendor.findOne({ user_id: req.user._id });

            if (!vendorProfile || (req.user.role !== 'admin' && product.vendorId.toString() !== vendorProfile._id.toString())) {
                console.warn(`Unauthorized delete attempt on product ${product._id} by user ${req.user.email}`);
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }

            // Using deleteOne instead of remove for newer Mongoose versions
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error deleting product' });
    }
};
