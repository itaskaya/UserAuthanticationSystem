const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path")

const PORT = 5000;

const connectDB = require("./database/db");
const { adminAuth, userAuth } = require("./middleware/auth")

// MIDDLEWARES
// Veri tabanına bağlan...
connectDB();

// Kullanıcının kendi verilerine erişim izni verilmesi.
app.use(express.json())

// Route.js middleware (/api/auth için bir istek varsa kullanılır.)
app.use("/api/auth", require("./auth/route"))

// Cookie Parser
app.use(cookieParser());

// Sayfa Yönlendirmeleri
app.get("/", (req, res) => res.render("home"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))
app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" })
    res.redirect("/")
})

// Admin Route
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
// User Route
app.get("/basic", userAuth, (req, res) => res.render("user"));
// EJS görüntüleme motoru
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'script')))


app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

// Hata oluşursa yakala
process.on("unhandledRejection", err => {
    console.log(`Bir Hata Oluştu: ${err.message}`)
    server.close(() => process.exit(1))
})