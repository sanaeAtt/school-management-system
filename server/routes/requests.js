const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize(['teacher', 'manager']), createRequest);
router.get('/', authMiddleware, authorize(['manager', 'teacher']), getRequests); // Teacher sees only theirs? Logic needed.
router.put('/:id', authMiddleware, authorize('manager'), updateRequestStatus);

module.exports = router;
