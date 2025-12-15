const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize('manager'), createStudent);
router.get('/', authMiddleware, authorize(['manager', 'teacher']), getStudents);
router.put('/:id', authMiddleware, authorize('manager'), updateStudent);
router.delete('/:id', authMiddleware, authorize('manager'), deleteStudent);

module.exports = router;
