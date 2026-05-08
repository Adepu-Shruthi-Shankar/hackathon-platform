const express = require('express');
const router  = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  addJury,
  getAllJury,
  juryLogin,
  changePassword
} = require('../controllers/juryController');

router.post('/',                addJury);
router.get('/',    verifyToken, getAllJury);
router.post('/login',           juryLogin);
router.post('/change-password', changePassword);

module.exports = router;