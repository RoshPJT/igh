const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
