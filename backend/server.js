const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "cfcb77a01d0e3523127d19abca793865f1470fbf32d01fde3b69c461411fac76";


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("database connected successfully"))
.catch(err => console.log(err))

app.use(express.json());

const users = [
    { id: 1, email: "user@example.com", password: bcrypt.hashSync("password123",10)}
];

app.post("/login", async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return
    res.status(400).json({ message: "email and password are required"});
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
        return
    res.status(400).json({ message: "invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return
        res.status(400).json({ message: "Invalid email or password "});
    }

    const token = jwt.sign({ id: user.id, email: user.email },
        SECRET_KEY, {expiresIn: '1h'});

    res.json({ message: "Login successful", token });
});

app.get("/", (req, res) => {
    res.send("Server is running")
});

app.listen(PORT, () => {
    console.log(`server running in http://localhost:${PORT}`);
});