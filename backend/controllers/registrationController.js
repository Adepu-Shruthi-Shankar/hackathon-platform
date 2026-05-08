const db = require('../config/db');

const registerForHackathon = async (req, res) => {
  const { hackathon_id, student_name, student_email, college_name, phone } = req.body;
  if (!hackathon_id || !student_name || !student_email || !college_name) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [existing] = await db.query(
      'SELECT * FROM registrations WHERE hackathon_id = ? AND student_email = ?',
      [hackathon_id, student_email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already registered for this hackathon.' });
    }
    await db.query(
      `INSERT INTO registrations (hackathon_id, student_name, student_email, college_name, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [hackathon_id, student_name, student_email, college_name, phone || '']
    );
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getRegistrations = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM registrations
       WHERE hackathon_id = ?
       ORDER BY registered_at DESC`,
      [hackathonId]
    );
    res.status(200).json({ registrations: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateRegistrationStatus = async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    await db.query(
      'UPDATE registrations SET status = ? WHERE id = ?',
      [status, id]
    );
    res.status(200).json({ message: `Registration ${status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getRegistrationStats = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'approved') as approved,
        SUM(status = 'rejected') as rejected,
        SUM(status = 'pending')  as pending
       FROM registrations WHERE hackathon_id = ?`,
      [hackathonId]
    );
    res.status(200).json({ stats: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  registerForHackathon,
  getRegistrations,
  updateRegistrationStatus,
  getRegistrationStats
};