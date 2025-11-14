const express = require('express');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const Job = require('../models/Job');

const router = express.Router();

// Post job
router.post('/jobs', auth, roles(['employer']), async (req,res) => {
  const job = new Job({ ...req.body, employer: req.user._id, status: 'pending' });
  await job.save();
  res.json(job);
});

// Get employer jobs
router.get('/jobs', auth, roles(['employer']), async (req,res) => {
  const jobs = await Job.find({ employer: req.user._id });
  res.json(jobs);
});

module.exports = router;
