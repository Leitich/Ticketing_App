import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db/connection.js";
import eventRoutes from "./routes/events.js";
import ticketRoutes from "./routes/tickets.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

// Test DB connection
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL Database");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => res.send("Ticketing API running"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




// // 🏠 Default route
// app.get("/", (req, res) => {
//   res.send("Ticketing API is running!");
// });

// // POST - add new event
// app.post("/api/events", verifyApiKey, async (req, res) => {
//   const { name, location, date, price } = req.body;
//   try {
//     await pool.query(
//       "INSERT INTO events (name, location, date, price) VALUES (?, ?, ?, ?)",
//       [name, location, date, price]
//     );
//     res.json({ message: "Event created successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create event" });
//   }
// });

// // POST - buy ticket (mock, will later connect to Mpesa)
// app.post("/api/tickets", verifyApiKey, async (req, res) => {
//   const { event_id, buyer_name, buyer_phone } = req.body;
//   try {
//     // generate unique ticket code
//     const ticketCode = `TCK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
//     await pool.query(
//       "INSERT INTO tickets (event_id, buyer_name, buyer_phone, ticket_code) VALUES (?, ?, ?, ?)",
//       [event_id, buyer_name, buyer_phone, ticketCode]
//     );
//     res.json({ message: "Ticket booked successfully", ticketCode });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to book ticket" });
//   }
// });

// // GET - all tickets
// app.get("/api/tickets", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT t.*, e.name AS event_name, e.date AS event_date
//       FROM tickets t
//       JOIN events e ON t.event_id = e.id
//       ORDER BY t.purchased_at DESC
//     `);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch tickets" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));