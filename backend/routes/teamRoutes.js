const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getTeams, getTeamDetails } = require('../controllers/teamController');

router.get('/hackathon/:hackathonId', verifyToken, getTeams);
router.get('/:teamId',               verifyToken, getTeamDetails);

module.exports = router;