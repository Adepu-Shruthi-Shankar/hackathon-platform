const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  getHackathonById
} = require('../controllers/submissionController');

router.get('/hackathon/:hackathonId',  verifyToken, getSubmissions);
router.get('/:id',                     verifyToken, getSubmissionById);
router.patch('/:id/status',            verifyToken, updateSubmissionStatus);
router.get('/hackathon-detail/:id',    verifyToken, getHackathonById);

module.exports = router;