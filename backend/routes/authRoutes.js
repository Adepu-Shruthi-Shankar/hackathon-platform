const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const db = require('../config/db');

router.post('/login', login);

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ success: false, message: 'All fields required' });
  try {
    if (role === 'jury') {
      const [existing] = await db.query('SELECT * FROM jury_members WHERE email = ?', [email]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO jury_members (full_name, email, password, username, designation) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, email.split('@')[0], 'Jury Member']);
    } else if (role === 'admin') {
      const [existing] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    } else {
      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });
      // users table stores plain text password in this app
      await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
    }
    res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;