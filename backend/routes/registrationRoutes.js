const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  registerForHackathon,
  getRegistrations,
  updateRegistrationStatus,
  getRegistrationStats
} = require('../controllers/registrationController');

// Public — student calls this (no token needed)
router.post('/', registerForHackathon);

// Protected — admin only
router.get('/hackathon/:hackathonId',       verifyToken, getRegistrations);
router.get('/hackathon/:hackathonId/stats', verifyToken, getRegistrationStats);
router.patch('/:id/status',                 verifyToken, updateRegistrationStatus);

module.exports = router;