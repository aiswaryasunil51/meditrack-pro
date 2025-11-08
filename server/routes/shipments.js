import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// GET all shipments
router.get("/", async (req, res) => {
  try {
    const [shipments] = await pool.query("SELECT * FROM shipments");
    res.json(shipments);
  } catch (err) {
    console.error("❌ Error fetching shipments:", err.message);
    res.status(500).json({ message: "Error fetching shipments" });
  }
});

// POST new shipment
router.post("/", async (req, res) => {
  try {
    const { orderId, drug, supplier, quantity, status, date } = req.body;
    const [result] = await pool.query(
      "INSERT INTO shipments (orderId, drug, supplier, quantity, status, date) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, drug, supplier, quantity, status, date]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding shipment:", err.message);
    res.status(500).json({ message: "Error adding shipment" });
  }
});

export default router;
