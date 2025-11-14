const express = require('express');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const Job = require('../models/Job');
const Application = require('../models/Application');

const router = express.Router();

// Public: list approved jobs
router.get('/', async (req,res) => {
  const jobs = await Job.find({ status: 'approved' }).populate('employer','companyName name');
  res.json(jobs);
});

// Driver applies to a job
router.post('/:id/apply', auth, roles(['driver']), async (req,res) => {
  const jobId = req.params.id;
  const { message } = req.body;
  const exists = await Application.findOne({ job: jobId, driver: req.user._id });
  if (exists) return res.status(400).json({ message: 'Already applied' });

  const application = new Application({ job: jobId, driver: req.user._id, message });
  await application.save();
  res.json(application);
});

module.exports = router;
