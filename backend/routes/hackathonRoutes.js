const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');

router.get('/public',  getAllHackathons);
router.post('/',       verifyToken, createHackathon);
router.get('/',        verifyToken, getAllHackathons);
router.get('/:id',     verifyToken, getHackathonById);
router.put('/:id',     verifyToken, updateHackathon);
router.delete('/:id',  verifyToken, deleteHackathon);

module.exports = router;