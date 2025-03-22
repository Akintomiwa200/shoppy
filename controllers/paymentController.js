const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET);
const Payment = require("../models/paymentModel"); // Assuming a Payment model exists

// Initiate Payment
exports.initiatePayment = async (req, res) => {
    try {
        const { email, amount } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required" });
        }

        const response = await Paystack.transaction.initialize({
            email,
            amount: amount * 100, // Convert to kobo
            currency: "NGN"
        });

        res.status(200).json({ message: "Payment initiated", data: response });
    } catch (error) {
        res.status(500).json({ message: "Payment error", error: error.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ message: "Transaction reference is required" });
        }

        const response = await Paystack.transaction.verify(reference);

        if (response.data.status === "success") {
            // Save transaction to database
            await Payment.create({
                email: response.data.customer.email,
                amount: response.data.amount / 100, // Convert from kobo
                reference: response.data.reference,
                status: response.data.status
            });

            return res.status(200).json({ message: "Payment verified successfully", data: response.data });
        } else {
            return res.status(400).json({ message: "Payment verification failed", data: response.data });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
};

// Webhook for Paystack Events (e.g., Payment Successful)
exports.handleWebhook = async (req, res) => {
    try {
        const event = req.body;

        if (event.event === "charge.success") {
            const payment = await Payment.findOne({ reference: event.data.reference });

            if (!payment) {
                await Payment.create({
                    email: event.data.customer.email,
                    amount: event.data.amount / 100, // Convert from kobo
                    reference: event.data.reference,
                    status: event.data.status
                });
            } else {
                await Payment.findOneAndUpdate({ reference: event.data.reference }, { status: event.data.status });
            }

            return res.status(200).json({ message: "Webhook received and processed successfully" });
        }

        res.status(400).json({ message: "Unhandled event type" });
    } catch (error) {
        res.status(500).json({ message: "Webhook processing error", error: error.message });
    }
};

// Retrieve a single transaction by reference
exports.getTransaction = async (req, res) => {
    try {
        const { reference } = req.params;

        const transaction = await Payment.findOne({ reference });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction retrieved successfully", data: transaction });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving transaction", error: error.message });
    }
};

// List all transactions with pagination and filtering
exports.getAllTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, email } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (email) filter.email = email;

        const transactions = await Payment.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Payment.countDocuments(filter);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
};
