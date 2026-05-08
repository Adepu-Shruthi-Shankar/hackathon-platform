const db = require('../config/db');

const getTeams = async (req, res) => {
  const { hackathonId } = req.params;
  try {
    const [teams] = await db.query(
      `SELECT * FROM teams WHERE hackathon_id = ? ORDER BY created_at DESC`,
      [hackathonId]
    );
    res.status(200).json({ teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getTeamDetails = async (req, res) => {
  const { teamId } = req.params;
  try {
    const [teams] = await db.query(
      'SELECT * FROM teams WHERE id = ?', [teamId]
    );
    if (teams.length === 0) {
      return res.status(404).json({ message: 'Team not found.' });
    }
    const [members] = await db.query(
      'SELECT * FROM team_members WHERE team_id = ?', [teamId]
    );
    res.status(200).json({ team: teams[0], members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getTeams, getTeamDetails };