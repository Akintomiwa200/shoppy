const express = require("express");
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require("../controllers/productController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           example: "661f5b9c9d1e4b001f0a43e9"
 *         name:
 *           type: string
 *           example: "Wireless Headphones"
 *         price:
 *           type: number
 *           example: 299.99
 *         description:
 *           type: string
 *           example: "High-quality noise-canceling headphones"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         inStock:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search term
 *         schema:
 *           type: string
 *           example: "laptop"
 *       - name: minPrice
 *         in: query
 *         description: Minimum price filter
 *         schema:
 *           type: number
 *           example: 50
 *       - name: maxPrice
 *         in: query
 *         description: Maximum price filter
 *         schema:
 *           type: number
 *           example: 1000
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Search term
 *         schema:
 *           type: string
 *           example: "gaming mouse"
 *     responses:
 *       200:
 *         description: List of matching products
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "661f5b9c9d1e4b001f0a43e9"
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", verifyToken, isAdmin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "661f5b9c9d1e4b001f0a43e9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", verifyToken, isAdmin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "661f5b9c9d1e4b001f0a43e9"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
