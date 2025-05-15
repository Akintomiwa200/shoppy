import express from "express";
import {
    initiatePayment,
    verifyPayment,
    getTransaction,
    getAllTransactions,
    handleWebhook
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

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
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *         - currency
 *         - email
 *       properties:
 *         amount:
 *           type: number
 *           example: 5000
 *         currency:
 *           type: string
 *           example: NGN
 *         email:
 *           type: string
 *           example: user@example.com
 * 
 *     PaymentVerification:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Payment verified successfully
 *         data:
 *           type: object
 *           properties:
 *             reference:
 *               type: string
 *               example: tx123456789
 *             amount:
 *               type: number
 *               example: 5000
 *             status:
 *               type: string
 *               example: success
 */

/**
 * @swagger
 * /api/payments/pay:
 *   post:
 *     summary: Initiate a payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 */
router.post("/pay", verifyToken, initiatePayment);

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   get:
 *     summary: Verify a payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reference
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: tx123456789
 *     responses:
 *       200:
 *         description: Payment verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentVerification'
 */
router.get("/verify/:reference", verifyToken, verifyPayment);

/**
 * @swagger
 * /api/payments/transaction/{reference}:
 *   get:
 *     summary: Retrieve a single transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reference
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: tx123456789
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 */
router.get("/transaction/:reference", verifyToken, getTransaction);

/**
 * @swagger
 * /api/payments/transactions:
 *   get:
 *     summary: Get all payment transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get("/transactions", verifyToken, getAllTransactions);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Paystack Webhook for Payment Updates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               event: "charge.success"
 *               data:
 *                 reference: "tx123456789"
 *                 amount: 5000
 *                 status: "success"
 *     responses:
 *       200:
 *         description: Webhook received successfully
 */
router.post("/webhook", handleWebhook);

export default router;