const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" }, // Ensures a default role
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
