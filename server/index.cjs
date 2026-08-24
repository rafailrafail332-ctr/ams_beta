const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Database Connection Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_ams',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ status: 'OK', message: 'Database Connected Successfully', result: rows[0].result });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// Get All Units
app.get('/api/units', async (req, res) => {
  try {
    const [units] = await db.query(`
      SELECT 
        u.id, u.unit_no AS unitNo, c.cluster_name AS cluster, u.tipe, 
        u.owner_name AS owner, u.progress, u.status_pekerjaan AS status, 
        u.contractor_name AS contractor, u.start_date AS startDate, 
        u.target_date AS targetDate, u.note,
        l.sertifikat_induk AS sertifikatInduk, l.pecah_sertifikat AS pecahSertifikat,
        l.pbg_no AS pbg, l.ajb_status AS ajb, l.status_final AS legalStatus,
        f.harga, f.skema_pembayaran AS skema, f.dp_status AS dpStatus,
        f.pencairan_kpr AS pencairanKpr, f.batp_payment_status AS batpPayment
      FROM units u
      LEFT JOIN clusters c ON u.cluster_id = c.id
      LEFT JOIN unit_legals l ON u.id = l.unit_id
      LEFT JOIN unit_finances f ON u.id = f.unit_id
      ORDER BY u.created_at DESC
    `);
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`AMS Backend API Running on http://localhost:${PORT}`);
});
