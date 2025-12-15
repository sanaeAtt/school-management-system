const express = require('express');
const router = express.Router();
const { createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('manager'), createSubject);
router.get('/', authMiddleware, authorize(['manager', 'teacher', 'student']), getSubjects);
router.put('/:id', authMiddleware, authorize('manager'), updateSubject);
router.delete('/:id', authMiddleware, authorize('manager'), deleteSubject);

module.exports = router;
