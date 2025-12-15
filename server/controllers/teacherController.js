const { Teacher, User, Subject, TeacherSubject } = require('../models');
const bcrypt = require('bcryptjs');

// Create Teacher
const createTeacher = async (req, res) => {
    const { name, phone, email, username, password, subjects, commission_rates } = req.body;

    try {
        // 1. Create User
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'teacher'
        });

        // 2. Create Teacher Profile
        const teacher = await Teacher.create({
            name,
            phone,
            email,
            user_id: user.id
        });

        // 3. Assign Subjects (if any)
        if (subjects && subjects.length > 0) {
            // subjects is array of subject_ids. commission_rates is object { subject_id: rate }
            for (const subjectId of subjects) {
                const rate = commission_rates ? commission_rates[subjectId] : 0.5; // Default 50%
                await TeacherSubject.create({
                    teacher_id: teacher.teacher_id,
                    subject_id: subjectId,
                    commission_rate: rate
                });
            }
        }

        res.status(201).json(teacher);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get All Teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({ include: [Subject] });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Teacher
const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    try {
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        teacher.name = name || teacher.name;
        teacher.phone = phone || teacher.phone;
        teacher.email = email || teacher.email;
        await teacher.save();

        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        // Should also delete associated User? Yes.
        if (teacher.user_id) {
            await User.destroy({ where: { id: teacher.user_id } });
        }
        await teacher.destroy();
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTeacher, getTeachers, updateTeacher, deleteTeacher };
