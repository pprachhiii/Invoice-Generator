const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path= require("path");
const bcrypt = require("bcryptjs"); // For hashing the password
const connectDB = require("../config/mongoose");
const { User, Client, InvoiceItem, Invoice } = require("../models/invoice");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Load env
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// db
connectDB();

app.set("view engine" ,"ejs");
app.set("views", path.join(__dirname, "../views")); // ✅ Fixed the views path
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"../public")));
app.use(express.json()); // Allows JSON parsing

app.get("/", async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: "Paid" });
        const pendingInvoices = await Invoice.countDocuments({ status: "Pending" });
        const overdueInvoices = await Invoice.countDocuments({ status: "Overdue" });
        const recentInvoices = await Invoice.find().populate("client_id").sort({ createdAt: -1 }).limit(5);

        res.render("dashboard", {
            totalClients,
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            overdueInvoices,
            recentInvoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading dashboard.");
    }
});

const port = process.env.PORT || 5000;

app.get("/clients",async(req, res)=>{
    try {
        let clients = await Client.find();

        res.render("clients",{clients});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading clients.");
    }
})
app.get("/invoices", async (req, res) => {
    try {
        let invoices = await Invoice.find().populate("client_id"); // Get all invoices + client details
        res.render("invoices", { invoices });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading invoices.");
    }
});
app.get("/invoices/new", async (req, res) => {
    try {
        let clients = await Client.find();
        let invoices = await Invoice.find().populate("client_id"); // Get all invoices + client details
        res.render("new",{invoices,clients});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
});

app.post("/invoices", async (req, res) => {
    try {
        let { client_id, new_client_name, new_client_email, new_client_phone, new_client_address, new_user_name, new_user_email,new_user_password, invoice_number, date, status, items } = req.body;

        let selectedClientId = client_id;

        // If a new client is added, create it first
        if (client_id === "new") {
            const newClient = new Client({
                name: new_client_name,
                email: new_client_email,
                phone: new_client_phone,
                address: new_client_address
            });

            const savedClient = await newClient.save();
            selectedClientId = savedClient._id;  // Assign new client's ID
        }

        // 🛠 Ensure items exist before mapping
        const formattedItems = Array.isArray(items) ? items.map(item => ({
            description: item.description || "No description",
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            total: (Number(item.quantity) || 1) * (Number(item.price) || 0)
        })) : [];

        // Create Invoice
        const newInvoice = new Invoice({
            client_id: selectedClientId,
            invoice_number: invoice_number,
            date: new Date(date),
            status: status,
            items: formattedItems,
            total_amount: formattedItems.reduce((sum, item) => sum + item.total, 0) // Calculate total
        });
        await newInvoice.save();

        // Check if user exists before adding
        const existingUser = await User.findOne({ email: new_user_email });
        if (!existingUser) {
            const newUser = new User({
                name: new_user_name,
                email: new_user_email,
                password: await bcrypt.hash(new_user_password, 10), // Hash password before saving
                created_at: new Date()
            });
            await newUser.save();
        }

        res.redirect("/"); // Redirect to dashboard
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Adding Invoice.");
    }
});


app.get("/invoices/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id).populate("client_id");

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        // Get all clients for the dropdown
        const clients = await Client.find();

        // Just for demo: Load user based on email in invoice (you may adjust this logic)
        const user = await User.findOne(); // or however you're tracking current user

        res.render("view",{
            invoice,
            clients,
            user: user || { name: "Admin", email: "admin@example.com" } // fallback
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading invoice details.");
    }
});

app.get("/invoices/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;

        // Get invoice
        const invoice = await Invoice.findById(id).populate("client_id");

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        // Get all clients for the dropdown
        const clients = await Client.find();

        // Just for demo: Load user based on email in invoice (you may adjust this logic)
        const user = await User.findOne(); // or however you're tracking current user

        res.render("edit", {
            invoice,
            clients,
            user: user || { name: "Admin", email: "admin@example.com" } // fallback
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading invoice edit page.");
    }
});

app.put("/invoices/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { client_id, invoice_number, date, status, items } = req.body;

        const formattedItems = Array.isArray(items)
            ? items.map(item => ({
                  description: item.description,
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                  total: Number(item.quantity) * Number(item.price)
              }))
            : [];

        await Invoice.findByIdAndUpdate(id, {
            client_id,
            invoice_number,
            date: new Date(date),
            status,
            items: formattedItems,
            total_amount: formattedItems.reduce((sum, item) => sum + item.total, 0)
        });

        res.redirect("/invoices");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating invoice.");
    }
});

app.delete("/invoices/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Invoice.findByIdAndDelete(id); // Actually delete from DB
        res.redirect("/invoices");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting invoice.");
    }
});

app.listen(port,()=>{
    console.log(`Server is listening at ${port}.`);
})

