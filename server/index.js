
require("dotenv").config();

// Import the libraries we installed
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const cors = require("cors"); 

const app = express();

app.use(express.json());

app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected at:", res.rows[0].now);
  }
});


app.post("/register", async (req, res) => {
  try {
  
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    
    const userId = result.rows[0].id;
    const userEmail = result.rows[0].email;

    
    const token = jwt.sign(
      { userId, email: userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

   
    res.json({ token, userId });
  } catch (error) {
    
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    // Any other error
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});


app.post("/login", async (req, res) => {
  try {
   
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }


    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    
    const passwordMatch = await bcrypt.compare(password, user.password);

    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
