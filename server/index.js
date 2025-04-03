const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path= require("path");
const connectDB = require("../config/mongoose");
const { User, Client, InvoiceItem, Invoice } = require("../models/invoice");

// Load env
dotenv.config();

// db
connectDB();

app.set("view engine" ,"ejs");
app.set("views", path.join(__dirname, "../views")); // ✅ Fixed the views path

app.get("/", async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: "Paid" });
        const pendingInvoices = await Invoice.countDocuments({ status: "Pending" });
        const overdueInvoices = await Invoice.countDocuments({ status: "Overdue" });

        res.render("dashboard", {
            totalClients,
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            overdueInvoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading dashboard.");
    }
});

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is listening at ${port}.`);
})

