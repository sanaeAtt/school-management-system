const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Teacher, Student } = require('../models');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            role: user.role,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

        // Fetch functionality specific data (e.g. teacher_id, student_id)
        let profileData = {};
        if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ where: { user_id: user.id } });
            if (teacher) profileData = { teacher_id: teacher.teacher_id, name: teacher.name };
        } else if (user.role === 'student') {
            const student = await Student.findOne({ where: { user_id: user.id } });
            if (student) profileData = { student_id: student.student_id, name: student.name };
        }

        res.json({ token, user: { ...payload, ...profileData } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { login };
