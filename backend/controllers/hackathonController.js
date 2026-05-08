const db = require('../config/db');

const createHackathon = async (req, res) => {
  const { title, description, start_date, end_date, fee, eligibility, status } = req.body;
  if (!title || !description || !start_date || !end_date || !eligibility) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO hackathons (title, description, start_date, end_date, fee, eligibility, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, start_date, end_date, fee || 0, eligibility, status || 'active']
    );
    res.status(201).json({ message: 'Hackathon created successfully', hackathonId: result.insertId });
  } catch (error) {
    console.error('Create hackathon error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getAllHackathons = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*,
        (SELECT COUNT(*) FROM registrations r WHERE r.hackathon_id = h.id) AS registered_count,
        (SELECT COUNT(*) FROM registrations r WHERE r.hackathon_id = h.id AND r.submission_file IS NOT NULL) AS submitted_count
      FROM hackathons h
      ORDER BY h.created_at DESC
    `);
    res.status(200).json({ hackathons: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getHackathonById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM hackathons WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found.' });
    }
    res.status(200).json({ hackathon: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateHackathon = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, fee, eligibility, status } = req.body;
  if (!title || !description || !start_date || !end_date || !eligibility) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }
  try {
    await db.query(
      `UPDATE hackathons SET title=?, description=?, start_date=?,
       end_date=?, fee=?, eligibility=?, status=? WHERE id=?`,
      [title, description, start_date, end_date, fee || 0, eligibility, status, id]
    );
    res.status(200).json({ message: 'Hackathon updated successfully.' });
  } catch (error) {
    console.error('Update hackathon error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteHackathon = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM hackathons WHERE id = ?', [id]);
    res.status(200).json({ message: 'Hackathon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
};