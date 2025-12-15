const express = require('express');
const router = express.Router();
const { createEntry, getTimetable, updateEntry, deleteEntry } = require('../controllers/timetableController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('manager'), createEntry);
router.get('/', authMiddleware, getTimetable);
router.put('/:id', authMiddleware, authorize('manager'), updateEntry);
router.delete('/:id', authMiddleware, authorize('manager'), deleteEntry);

module.exports = router;
