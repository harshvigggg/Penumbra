
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

// ===========================
// SONG ENDPOINTS
// ===========================

// POST /songs
// Create a new song
// User sends: { title, artist, lyrics, language, genre }
// Returns: { songId, message }
app.post("/songs", async (req, res) => {
  try {
    // Extract data from request body
    const { title, artist, lyrics, language, genre } = req.body;

    // Get userId from the token (sent in headers as "Authorization: Bearer <token>")
    // For now, we'll get it from a test header. Later we'll add middleware to verify JWT
    const userId = req.headers["user-id"];

    // Validate inputs
    if (!title || !artist || !lyrics || !language) {
      return res.status(400).json({ error: "Title, artist, lyrics, and language required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    // Insert song into database
    const result = await pool.query(
      "INSERT INTO songs (title, artist, lyrics, language, genre, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [title, artist, lyrics, language, genre, userId]
    );

    const songId = result.rows[0].id;

    res.json({ songId, message: "Song created successfully" });
  } catch (error) {
    console.error("Create song error:", error);
    res.status(500).json({ error: "Failed to create song" });
  }
});

// GET /songs/:id
// Get a specific song with its metadata
// Returns: { id, title, artist, lyrics, language, genre, createdBy }
app.get("/songs/:id", async (req, res) => {
  try {
    // Get song ID from URL parameter
    const songId = req.params.id;

    // Query: SELECT * FROM songs WHERE id = $1
    const result = await pool.query("SELECT * FROM songs WHERE id = $1", [songId]);

    // Check if song exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Return the song
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get song error:", error);
    res.status(500).json({ error: "Failed to fetch song" });
  }
});

// POST /interpretations
// Add an interpretation to a specific line of a song
// User sends: { songId, lineNumber, content }
// Returns: { interpretationId, message }
app.post("/interpretations", async (req, res) => {
  try {
    // Extract data from request
    const { songId, lineNumber, content } = req.body;
    const userId = req.headers["user-id"];

    // Validate inputs
    if (!songId || !lineNumber || !content) {
      return res.status(400).json({ error: "Song ID, line number, and content required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    // Verify song exists
    const songCheck = await pool.query("SELECT id FROM songs WHERE id = $1", [songId]);
    if (songCheck.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Insert interpretation into database
    const result = await pool.query(
      "INSERT INTO interpretations (song_id, line_number, user_id, content) VALUES ($1, $2, $3, $4) RETURNING id",
      [songId, lineNumber, userId, content]
    );

    const interpretationId = result.rows[0].id;

    res.json({ interpretationId, message: "Interpretation added successfully" });
  } catch (error) {
    console.error("Create interpretation error:", error);
    res.status(500).json({ error: "Failed to add interpretation" });
  }
});

// GET /songs/:songId/line/:lineNumber/interpretations
// Get all interpretations for a specific line of a song
// Returns: array of interpretations sorted by votes (highest first)
app.get("/songs/:songId/line/:lineNumber/interpretations", async (req, res) => {
  try {
    // Get song ID and line number from URL parameters
    const { songId, lineNumber } = req.params;

    // Query: get all interpretations for this line, sorted by votes descending
    const result = await pool.query(
      "SELECT id, user_id, content, votes, created_at FROM interpretations WHERE song_id = $1 AND line_number = $2 ORDER BY votes DESC",
      [songId, lineNumber]
    );

    // Return interpretations (empty array if no interpretations exist)∫
    res.json(result.rows);
  } catch (error) {
    console.error("Get interpretations error:", error);
    res.status(500).json({ error: "Failed to fetch interpretations" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
