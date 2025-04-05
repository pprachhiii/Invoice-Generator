const connectDB = require("../config/mongoose.js"); // ✅ Ensure DB is connected
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const { User, Client, Invoice, InvoiceItem } = require("../models/invoice");

dotenv.config({ path: path.resolve(__dirname, "../.env") }); // ✅ Load environment variables

const insertData = async () => {
    try {
        await connectDB(); // 🚀 Ensure MongoDB is connected before inserting data

        // Insert Multiple Users
        await User.insertMany([
            { name: "John Doe", email: "john@example.com", password: "pass123" },
            { name: "Jane Doe", email: "jane@example.com", password: "securepass" }
        ]);
        console.log("✅ Users inserted successfully");

        // Insert Multiple Clients
        const clients = await Client.insertMany([
            { name: "ABC Corp", email: "abc@example.com", phone: "1234567890", address: "123 Business St" },
            { name: "XYZ Ltd", email: "xyz@example.com", phone: "9876543210", address: "456 Market St" }
        ]);
        console.log("✅ Clients inserted successfully");

        // Insert Multiple Invoice Items
        const items = await InvoiceItem.insertMany([
            { description: "Web Development", quantity: 1, price: 500, total: 500 },
            { description: "Logo Design", quantity: 2, price: 50, total: 100 }
        ]);
        console.log("✅ Invoice Items inserted successfully");

        // Insert Multiple Invoices (Link to Clients)
        await Invoice.insertMany([
            { client_id: clients[0]._id, invoice_number: "INV-1001", total_amount: 500, status: "Pending", items: [items[0]] },
            { client_id: clients[1]._id, invoice_number: "INV-1002", total_amount: 100, status: "Paid", items: [items[1]] }
        ]);
        console.log("✅ Invoices inserted successfully");

    } catch (error) {
        console.error("❌ Error inserting data:", error);
    } finally {
        mongoose.connection.close(); // ✅ Ensure DB connection is closed
        process.exit(); // ✅ Exit the script
    }
};

insertData();
