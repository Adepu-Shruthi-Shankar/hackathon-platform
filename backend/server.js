const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const juryRoutes = require('./routes/juryRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const teamRoutes = require('./routes/teamRoutes');
const juryResultRoutes = require('./routes/juryResultRoutes');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Main routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/jury', juryRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/jury-results', juryResultRoutes);

// College routes
app.post('/api/college/verify', upload.single('professor_id'), async (req, res) => {
  const { email, department } = req.body;
  const file = req.file;
  if (!email || !department || !file)
    return res.status(400).json({ success: false, message: 'All fields required' });
  try {
    await db.query('INSERT INTO college_verifications (email, department, professor_id) VALUES (?, ?, ?)',
      [email, department, 'uploads/' + file.filename]);
    res.status(201).json({ success: true, message: 'Verification submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/college/verification', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM college_verifications ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/college/registrations', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.name AS student_name FROM registrations r
      JOIN users u ON r.student_id = u.id ORDER BY r.created_at DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/approve/:id', async (req, res) => {
  try {
    await db.query('UPDATE registrations SET approval_status = ? WHERE id = ?', ['approved', req.params.id]);
    res.status(200).json({ success: true, message: 'Approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/reject/:id', async (req, res) => {
  try {
    await db.query('UPDATE registrations SET approval_status = ? WHERE id = ?', ['rejected', req.params.id]);
    res.status(200).json({ success: true, message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Student routes
app.post('/api/register', async (req, res) => {
  const { student_id, hackathon_id, teamName, projectName, leaderEmail } = req.body;
  if (!student_id || !hackathon_id || !teamName || !projectName || !leaderEmail)
    return res.status(400).json({ success: false, message: 'All fields required' });
  try {
    const [existing] = await db.query('SELECT * FROM registrations WHERE student_id = ? AND hackathon_id = ?', [student_id, hackathon_id]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Already registered' });
    const team_details = JSON.stringify({ teamName, projectName, leaderEmail });
    const [result] = await db.query(
      'INSERT INTO registrations (student_id, hackathon_id, team_details, payment_status, approval_status) VALUES (?, ?, ?, ?, ?)',
      [student_id, hackathon_id, team_details, 'pending', 'pending']
    );
    res.status(201).json({ success: true, message: 'Registered successfully', data: { registration_id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/my-registrations/:student_id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM registrations WHERE student_id = ? ORDER BY created_at DESC', [req.params.student_id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/registrations/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM registrations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/payment/:id', async (req, res) => {
  try {
    await db.query('UPDATE registrations SET payment_status = ? WHERE id = ?', ['paid', req.params.id]);
    res.status(200).json({ success: true, message: 'Payment successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/upload', upload.single('submission_file'), async (req, res) => {
  const { registration_id } = req.body;
  const file = req.file;
  if (!registration_id || !file)
    return res.status(400).json({ success: false, message: 'File and registration ID required' });
  try {
    const [regs] = await db.query('SELECT payment_status, approval_status FROM registrations WHERE id = ?', [registration_id]);
    if (regs.length === 0) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (regs[0].payment_status !== 'paid') return res.status(403).json({ success: false, message: 'Payment required first' });
    if (regs[0].approval_status !== 'approved') return res.status(403).json({ success: false, message: 'Approval required first' });
    await db.query('UPDATE registrations SET submission_file = ? WHERE id = ?', ['uploads/' + file.filename, registration_id]);
    res.status(200).json({ success: true, message: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Jury evaluation routes
app.get('/api/jury-dashboard/submissions', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.hackathon_id, r.team_details, r.submission_file,
             r.approval_status, r.payment_status, u.name AS student_name,
             h.title AS hackathon_title,
             je.rating, je.feedback, je.id AS evaluation_id
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      JOIN hackathons h ON r.hackathon_id = h.id
      LEFT JOIN jury_evaluations je ON je.registration_id = r.id
      WHERE r.approval_status = 'approved' AND r.submission_file IS NOT NULL
      ORDER BY r.created_at DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/jury-dashboard/evaluate', async (req, res) => {
  const { registration_id, jury_id, rating, feedback } = req.body;
  if (!registration_id || !jury_id || !rating)
    return res.status(400).json({ success: false, message: 'All fields required' });
  try {
    const [existing] = await db.query('SELECT * FROM jury_evaluations WHERE registration_id = ? AND jury_id = ?', [registration_id, jury_id]);
    if (existing.length > 0) {
      await db.query('UPDATE jury_evaluations SET rating = ?, feedback = ? WHERE registration_id = ? AND jury_id = ?',
        [rating, feedback, registration_id, jury_id]);
    } else {
      await db.query('INSERT INTO jury_evaluations (registration_id, jury_id, rating, feedback) VALUES (?, ?, ?, ?)',
        [registration_id, jury_id, rating, feedback]);
    }
    res.status(200).json({ success: true, message: 'Evaluation submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'HackAdmin API running!' });
});

// Announce winner
app.post('/api/announce-winner', async (req, res) => {
  const { hackathon_id, team_name, project_name, rating, feedback } = req.body;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS winners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hackathon_id INT NOT NULL,
        team_name VARCHAR(255),
        project_name VARCHAR(255),
        rating INT,
        feedback TEXT,
        announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(
      'INSERT INTO winners (hackathon_id, team_name, project_name, rating, feedback) VALUES (?, ?, ?, ?, ?)',
      [hackathon_id, team_name, project_name, rating, feedback]
    );
    res.status(200).json({ success: true, message: 'Winner announced' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get winner for a hackathon
app.get('/api/winner/:hackathon_id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM winners WHERE hackathon_id = ? ORDER BY announced_at DESC LIMIT 1', [req.params.hackathon_id]);
    res.status(200).json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all winners (for student/college/jury to see)
app.get('/api/winners', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM winners ORDER BY announced_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});