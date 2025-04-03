const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Client Schema
const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
});

// Invoice Item Schema (Stores individual line items)
const invoiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
});

// Invoice Schema (References Invoice Items)
const invoiceSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    invoice_number: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    total_amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
    items: [invoiceItemSchema]  
});

// Create Mongoose Models
const User = mongoose.model("User", userSchema);
const Client = mongoose.model("Client", clientSchema);
const InvoiceItem = mongoose.model("InvoiceItem", invoiceItemSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = { User, Client, InvoiceItem, Invoice };
