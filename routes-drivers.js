const express = require('express');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const DriverProfile = require('../models/DriverProfile');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // for production use Cloudinary

const router = express.Router();

// Get profile
router.get('/me', auth, roles(['driver']), async (req, res) => {
  const profile = await DriverProfile.findOne({ user: req.user._id }).populate('user','name email');
  res.json(profile);
});

// Create or update profile
router.post('/me', auth, roles(['driver']), async (req, res) => {
  const data = req.body;
  let profile = await DriverProfile.findOne({ user: req.user._id });
  if (profile) {
    Object.assign(profile, data);
    await profile.save();
    return res.json(profile);
  }
  profile = new DriverProfile({ user: req.user._id, ...data });
  await profile.save();
  res.json(profile);
});

// Upload portfolio (file)
router.post('/portfolio', auth, roles(['driver']), upload.single('file'), async (req, res) => {
  // For demo, we return local path. Replace with Cloudinary upload
  const profile = await DriverProfile.findOne({ user: req.user._id });
  const fileUrl = `/uploads/${req.file.filename}`; // replace with cloudinary result.url
  profile.portfolio.push({ url: fileUrl, name: req.file.originalname });
  await profile.save();
  res.json(profile);
});

module.exports = router;
