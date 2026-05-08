const db = require('../config/db');

const getJuryResult = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM jury_results WHERE hackathon_id = ?',
      [hackathonId]
    );
    res.status(200).json({ result: rows[0] || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const submitJuryResult = async (req, res) => {
  const { hackathon_id, team_id, team_name, leader_name, project_title } = req.body;
  if (!hackathon_id || !team_name || !leader_name || !project_title) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    await db.query(
      'DELETE FROM jury_results WHERE hackathon_id = ?', [hackathon_id]
    );
    await db.query(
      `INSERT INTO jury_results 
       (hackathon_id, team_id, team_name, leader_name, project_title)
       VALUES (?, ?, ?, ?, ?)`,
      [hackathon_id, team_id || null, team_name, leader_name, project_title]
    );
    res.status(201).json({ message: 'Jury result submitted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const announceWinner = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM jury_results WHERE hackathon_id = ?', [hackathonId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No jury result found.' });
    }
    await db.query(
      `UPDATE jury_results SET announced = TRUE, announced_at = NOW()
       WHERE hackathon_id = ?`,
      [hackathonId]
    );
    await db.query(
      `UPDATE hackathons SET status = 'ended' WHERE id = ?`,
      [hackathonId]
    );
    res.status(200).json({ message: 'Winner announced to all dashboards!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getAnnouncedWinners = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT jr.*, h.title as hackathon_title 
       FROM jury_results jr
       JOIN hackathons h ON jr.hackathon_id = h.id
       WHERE jr.announced = TRUE
       ORDER BY jr.announced_at DESC`
    );
    res.status(200).json({ winners: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getJuryResult,
  submitJuryResult,
  announceWinner,
  getAnnouncedWinners
};