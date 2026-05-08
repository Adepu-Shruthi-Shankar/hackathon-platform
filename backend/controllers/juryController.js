const db          = require('../config/db');
const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const transporter = require('../config/mailer');
require('dotenv').config();

const generateUsername = (fullName) => {
  return fullName.toLowerCase().replace(/\s+/g, '_');
};

const generatePassword = (fullName) => {
  const firstName = fullName.split(' ')[0].toLowerCase();
  return `${firstName}@123`;
};

const sendCredentialsMail = async (to, full_name, username, password) => {
  const mailOptions = {
    from: `"HackAdmin Platform" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your Jury Panel Login Credentials — HackAdmin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          body { margin:0; padding:0; background:#060608; font-family:Arial,sans-serif; color:#f4f0ff; }
          .wrapper { max-width:520px; margin:40px auto; background:#0d0d14; border:1px solid rgba(255,255,255,0.055); border-radius:20px; overflow:hidden; }
          .header { padding:32px 36px 20px; border-bottom:1px solid rgba(255,255,255,0.055); }
          .logo { font-size:20px; font-weight:800; color:#f4f0ff; }
          .logo span { color:#a855f7; }
          .body { padding:28px 36px; }
          .greeting { font-size:22px; font-weight:700; color:#f4f0ff; margin-bottom:10px; }
          .subtitle { font-size:13px; color:#6b7280; line-height:1.6; margin-bottom:28px; }
          .cred-box { background:rgba(168,85,247,0.06); border:1px solid rgba(168,85,247,0.18); border-radius:14px; padding:20px 24px; margin-bottom:24px; }
          .cred-label { font-size:10px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:6px; }
          .cred-value { font-size:18px; font-weight:700; color:#c4b5fd; font-family:'Courier New',monospace; margin-bottom:18px; }
          .warning { background:rgba(251,176,48,0.06); border:1px solid rgba(251,176,48,0.18); border-radius:10px; padding:12px 16px; font-size:12px; color:#FBB030; margin-bottom:24px; }
          .footer { padding:18px 36px; border-top:1px solid rgba(255,255,255,0.055); font-size:11px; color:#6b7280; text-align:center; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><div class="logo">⚡ Hack<span>Admin</span></div></div>
          <div class="body">
            <div class="greeting">Welcome, ${full_name}!</div>
            <div class="subtitle">You have been onboarded as a Jury Member on the HackAdmin Platform. Here are your login credentials.</div>
            <div class="cred-box">
              <div class="cred-label">Username</div>
              <div class="cred-value">${username}</div>
              <div class="cred-label">Password</div>
              <div class="cred-value">${password}</div>
            </div>
            <div class="warning">⚠️ Please log in and change your password immediately after your first login.</div>
          </div>
          <div class="footer">HackAdmin Platform • Automated message</div>
        </div>
      </body>
      </html>
    `
  };
  await transporter.sendMail(mailOptions);
};

// ── Add Jury ──
const addJury = async (req, res) => {
  const { full_name, email, expertise, organization, designation } = req.body;
  if (!full_name || !email || !expertise || !organization || !designation) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [existing] = await db.query(
      'SELECT * FROM jury_members WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Jury member with this email already exists.' });
    }
    const username       = generateUsername(full_name);
    const plainPassword  = generatePassword(full_name);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await db.query(
      `INSERT INTO jury_members
       (full_name, email, expertise, organization, designation, username, password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, expertise, organization, designation, username, hashedPassword]
    );
    try {
      await sendCredentialsMail(email, full_name, username, plainPassword);
    } catch (mailErr) {
      console.error('Mail error:', mailErr.message);
    }
    res.status(201).json({ message: 'Jury member added. Credentials sent to email.' });
  } catch (error) {
    console.error('Add jury error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ── Get All Jury ──
const getAllJury = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, expertise, organization,
       designation, username, password_changed, created_at
       FROM jury_members ORDER BY created_at DESC`
    );
    res.status(200).json({ jury: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// ── Jury Login ──
const juryLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [rows] = await db.query(
      'SELECT * FROM jury_members WHERE username = ?', [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const jury    = rows[0];
    const isMatch = await bcrypt.compare(password, jury.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const token = jwt.sign(
      { id: jury.id, username: jury.username, full_name: jury.full_name, role: 'jury' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      jury: {
        id:               jury.id,
        full_name:        jury.full_name,
        email:            jury.email,
        username:         jury.username,
        designation:      jury.designation,
        password_changed: jury.password_changed
      }
    });
  } catch (error) {
    console.error('Jury login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ── Change Password ──
const changePassword = async (req, res) => {
  const { username, old_password, new_password } = req.body;
  if (!username || !old_password || !new_password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [rows] = await db.query(
      'SELECT * FROM jury_members WHERE username = ?', [username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Jury member not found.' });
    }
    const jury    = rows[0];
    const isMatch = await bcrypt.compare(old_password, jury.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    await db.query(
      'UPDATE jury_members SET password = ?, password_changed = TRUE WHERE username = ?',
      [hashed, username]
    );
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { addJury, getAllJury, juryLogin, changePassword };