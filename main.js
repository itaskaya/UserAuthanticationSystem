const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const PORT = 5000;

const connectDB = require("./database/db");
const { adminAuth, userAuth } = require("./middleware/auth")

// MIDDLEWARES
// Veri tabanına bağlan
connectDB();
// Kullanıcının verilerine erişim izni verilmesi
app.use(express.json())
// Route.js middleware (/api/auth için bir istek varsa kullanılır.)
app.use("/api/auth", require("./auth/route"))
// Cookie Parser
app.use(cookieParser());
// Admin Route
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
// User Route
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

// Hata oluşursa yakala
process.on("unhandledRejection", err => {
    console.log(`Bir Hata Oluştu: ${err.message}`)
    server.close(() => process.exit(1))
})