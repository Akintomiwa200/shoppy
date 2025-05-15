
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        image: { type: String },
        stock: { type: Number, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
