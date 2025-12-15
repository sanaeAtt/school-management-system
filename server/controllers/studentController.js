const { Student, User, Subject, StudentSubject } = require('../models');
const bcrypt = require('bcryptjs');

// Create Student
const createStudent = async (req, res) => {
    const { name, phone, parent_phone, level, username, password, subjects } = req.body; // subjects = [id1, id2]

    try {
        // 1. Create User (Optional for students? Prompt says "Users Table: id, username...". And "Student Can: View timetable". So yes, they need login.)
        // If username/password not provided, generate defaults? 
        // I'll assume they are provided or generate them.

        const finalUsername = username || name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
        const finalPassword = password || 'student123';

        const existingUser = await User.findOne({ where: { username: finalUsername } });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(finalPassword, salt);

        const user = await User.create({
            username: finalUsername,
            password: hashedPassword,
            role: 'student'
        });

        // 2. Create Student Profile
        const student = await Student.create({
            name,
            phone,
            parent_phone,
            level,
            user_id: user.id
        });

        // 3. Enroll in Subjects
        if (subjects && subjects.length > 0) {
            for (const subjectId of subjects) {
                await StudentSubject.create({
                    student_id: student.student_id,
                    subject_id: subjectId,
                    enrollment_date: new Date()
                });
            }
        }

        res.status(201).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get Students
const getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({ include: [Subject] });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update and Delete can be similar... omitted for brevity, but I should implement them.
const updateStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await Student.update(req.body, { where: { student_id: id } });
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json(e); }
};

const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const s = await Student.findByPk(id);
        if (s && s.user_id) await User.destroy({ where: { id: s.user_id } });
        await Student.destroy({ where: { student_id: id } });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json(e); }
}

module.exports = { createStudent, getStudents, updateStudent, deleteStudent };
