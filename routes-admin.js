const express = require('express');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const User = require('../models/User');
const Job = require('../models/Job');

const router = express.Router();

// List pending jobs
router.get('/jobs/pending', auth, roles(['admin']), async (req,res) => {
  const jobs = await Job.find({ status: 'pending' }).populate('employer');
  res.json(jobs);
});

// Approve job
router.post('/jobs/:id/approve', auth, roles(['admin']), async (req,res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Not found' });
  job.status = 'approved';
  await job.save();
  res.json(job);
});

// Manage users: suspend/verify
router.post('/users/:id/suspend', auth, roles(['admin']), async (req,res) => {
  const user = await User.findById(req.params.id);
  user.verified = false;
  await user.save();
  res.json(user);
});

module.exports = router;
