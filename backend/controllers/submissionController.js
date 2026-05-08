const db = require('../config/db');

const getSubmissions = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM submissions WHERE hackathon_id = ? ORDER BY created_at DESC`,
      [hackathonId]
    );
    res.status(200).json({ submissions: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getSubmissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM submissions WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    res.status(200).json({ submission: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateSubmissionStatus = async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    await db.query(
      'UPDATE submissions SET status = ? WHERE id = ?', [status, id]
    );
    res.status(200).json({ message: 'Submission ' + status + '.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getHackathonById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM hackathons WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found.' });
    }
    res.status(200).json({ hackathon: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  getHackathonById
};