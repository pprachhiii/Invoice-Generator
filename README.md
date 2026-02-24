# 🧾 Invoice Generator Web App

Live Demo: [https://item-manager-psi.vercel.app/](https://invoice-generator-95re.onrender.com/)

A simple and intuitive invoice management application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to create, view, edit, and delete invoices, as well as manage client information with ease.

---

## 🚀 Features

- 📄 Create, read, update, and delete invoices
- 👥 Add new clients or select existing ones
- 💰 Auto-calculate line items and total amounts
- 📆 Manage invoice date and status (Paid, Pending, Overdue)
- 🖊️ Edit invoices dynamically
- 🔐 Associate invoices with users (basic user tracking)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** EJS Templates, HTML5, CSS3, Vanilla JavaScript
- **Templating Engine:** EJS

---

## 📁 Folder Structure

```
Invoice-Generator/
│
├── config/                  # MongoDB connection setup
│   └── mongoose.js
│
├── controllers/            # Business logic and DB interactions
│   └── init.js             # Optional: initial seed data
│
├── images/
│   └── Dashboard.png
│   └── InvoiceForm.png
|
├── models/                 # Mongoose schemas
│   ├── invoice.js
│
├── public/                 # Static files
│   └── js/
│       ├── app.js          #empty so far
│   └── css/
│       ├── dashboard.css
│       ├── clients.css
│       ├── invoice.css
│       ├── new.css
│       ├── edit.css
│       └── view.css
│
├── server/
│   └── index.js            # Main server entry point
|
├── views/                  # EJS templates
│   ├── clients.ejs
│   ├── dashboard.ejs
│   ├── edit.ejs
│   ├── invoices.ejs
│   ├── new.ejs
│   ├── view.ejs
│
├── .env                    # Environment variables (ignored in git)
├── .gitignore              # Files/folders excluded from Git
├── LICENSE
├──package-lock.json       # Auto-generated lockfile for exact dependency versions
├── package.json
└── README.md

```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/InvoiceGenerator.git
cd Invoice-Generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/invoice_app
```

### 4. Start the Server

```bash
nodemon server/index.js
```

Then open your browser and visit:  
📍 `http://localhost:8080`

---

### 🔗 Live Demo

Check out the live app here: [Invoice Generator App](https://invoice-generator-95re.onrender.com)

## 📸 Screenshots

### 📋 Invoice Form

![Invoice Form](./images/InvoiceForm.png)  
_Easily create invoices with dynamic line item calculation._

### 📊 Dashboard View

![Dashboard](./images/Dashboard.png)  
_Quick overview of all your invoices and their statuses._

## 🧾 Sample Usage

- Go to `/invoices/new` to create a new invoice.
- View, edit, or delete existing invoices from the dashboard.
- Add new clients directly from the invoice form if not already listed.
- All invoice items and totals are calculated automatically.

---

## 📌 .gitignore Includes

```gitignore
node_modules/
.env
```

---

## 💡 Future Enhancements

- Authentication system (login/register)
- PDF invoice generation
- Email invoices to clients
- Improved validations

---

## 📬 Contact

Made with ❤️ by Prachi Yadav

> Feel free to fork this repo or open an issue if you’d like to contribute or have suggestions!

## 🪪 License

MIT — Copyright © 2025 Prachi Yadav
See [LICENSE](./LICENSE) for full text.
