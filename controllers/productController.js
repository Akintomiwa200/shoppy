
import Product from "../models/productModel.js";

// Get all products with filtering, search, and pagination
export const getAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(filter)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

// Search products
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        const products = await Product.find({ name: { $regex: q, $options: "i" } });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error searching products", error });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, image, stock } = req.body;
        const newProduct = new Product({ name, price, description, image, stock });

        await newProduct.save();

        if (req.io) {
            req.io.emit("productAdded", newProduct);
        }

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        if (req.io) {
            req.io.emit("productUpdated", updatedProduct);
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

        if (req.io) {
            req.io.emit("productDeleted", deletedProduct);
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
