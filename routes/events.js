import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

// Create a new event
router.post("/", async (req, res) => {
  try {
    const { name, date, location, description } = req.body;

    // Check for missing fields
    if (!name || !date || !location || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await req.db.query(
      "INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)",
      [name, date, location, description]
    );

    res.status(201).json({ message: "✅ Event created successfully", eventId: result.insertId });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});


// Get all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM events ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
