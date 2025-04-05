const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path= require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // ⏳ Increase timeout to 30 sec
            socketTimeoutMS: 45000, // 🔄 Keep socket open longer
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
