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

// Add New Unit
app.post('/api/units', async (req, res) => {
  const { unitNo, cluster, tipe, owner, progress, status, contractor, startDate, targetDate, note } = req.body;
  try {
    const newId = `RUM-00${Date.now().toString().slice(-3)}`;
    await db.query(
      `INSERT INTO units (id, unit_no, cluster_id, tipe, owner_name, progress, status_pekerjaan, contractor_name, start_date, target_date, note)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, unitNo, tipe || '45/90', owner, progress || 0, status || 'Persiapan', contractor || 'PT Bangun Jaya', startDate || null, targetDate || null, note || '']
    );
    await db.query(`INSERT INTO unit_legals (unit_id) VALUES (?)`, [newId]);
    await db.query(`INSERT INTO unit_finances (unit_id) VALUES (?)`, [newId]);
    res.json({ success: true, message: 'Unit berhasil ditambahkan', id: newId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`AMS Backend API Running on http://localhost:${PORT}`);
});
