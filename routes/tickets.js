import express from "express";
import db from "../db/connection.js";
import crypto from "crypto";

const router = express.Router();

// Book a ticket
router.post("/", async (req, res) => {
  const { event_id, customer_name } = req.body;

  if (!event_id || !customer_name) {
    return res.status(400).json({ error: "Event ID and customer name are required" });
  }

  try {
    // Generate a random unique ticket code
    const ticket_code = "TICKET-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // Insert into database (including ticket_code!)
    const [result] = await db.query(
      "INSERT INTO tickets (event_id, customer_name, ticket_code) VALUES (?, ?, ?)",
      [event_id, customer_name, ticket_code]
    );

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: {
        id: result.insertId,
        event_id,
        customer_name,
        ticket_code
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to book ticket" });
  }
});

// 🧾 View all tickets
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tickets");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
