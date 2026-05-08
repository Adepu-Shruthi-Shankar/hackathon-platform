const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getJuryResult,
  submitJuryResult,
  announceWinner,
  getAnnouncedWinners
} = require('../controllers/juryResultController');

router.get('/hackathon/:hackathonId',  verifyToken, getJuryResult);
router.post('/',                       verifyToken, submitJuryResult);
router.patch('/announce/:hackathonId', verifyToken, announceWinner);
router.get('/announced',                            getAnnouncedWinners);

module.exports = router;