const express = require('express');
const router = express.Router();
const { getRooms, toggleMaintenance } = require('../controllers/roomController');

router.get('/', getRooms);
router.put('/:roomNumber/maintenance', toggleMaintenance);

module.exports = router;
