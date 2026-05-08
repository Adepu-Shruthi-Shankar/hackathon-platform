const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  try {
    // 1. Check jury_members table (jury login uses email now)
    const [juryRows] = await db.query('SELECT * FROM jury_members WHERE email = ?', [email]);
    if (juryRows.length > 0) {
      const jury = juryRows[0];
      const isMatch = await bcrypt.compare(password, jury.password);
      if (!isMatch)
        return res.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign(
        { id: jury.id, email: jury.email, name: jury.full_name, role: 'jury' },
        process.env.JWT_SECRET, { expiresIn: '8h' }
      );
      return res.status(200).json({
        message: 'Login successful', token, role: 'jury',
        user: { id: jury.id, name: jury.full_name, email: jury.email, username: jury.username, designation: jury.designation, role: 'jury' }
      });
    }

    // 2. Check users table (student, college)
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      const user = users[0];
      if (user.password !== password)
        return res.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET, { expiresIn: '8h' }
      );
      return res.status(200).json({ message: 'Login successful', token, role: user.role, user });
    }

    // 3. Check admins table
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = admin.password === password || await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
        process.env.JWT_SECRET, { expiresIn: '8h' }
      );
      return res.status(200).json({
        message: 'Login successful', token, role: 'admin',
        user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' }
      });
    }

    return res.status(401).json({ message: 'Invalid email or password.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { login };