const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('manager'), createTeacher);
router.get('/', authMiddleware, authorize(['manager', 'teacher']), getTeachers);
router.put('/:id', authMiddleware, authorize('manager'), updateTeacher);
router.delete('/:id', authMiddleware, authorize('manager'), deleteTeacher);

module.exports = router;
