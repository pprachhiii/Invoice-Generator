const express = require("express");
const app = express();
const path= require("path");
console.log("Mongoose loaded:", !!require("mongoose"));
const mongoose = require("mongoose");

const port = 8080;
const { User, Client, Invoice, InvoiceItem } = require("../models/invoice");

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

app.listen(port,()=>{
    console.log(`Server is listening at ${port}.`);
})


// MongoDB Connection
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/invoice', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
}

main();

