const sequelize = require('../config/database');
const User = require('./User');
const Teacher = require('./Teacher');
const Student = require('./Student');
const Subject = require('./Subject');
const TeacherSubject = require('./TeacherSubject');
const StudentSubject = require('./StudentSubject');
const Timetable = require('./Timetable');
const Payment = require('./Payment');
const ChangeRequest = require('./ChangeRequest');
const TeacherPayout = require('./TeacherPayout');

// Associations

// User <-> Teacher
User.hasOne(Teacher, { foreignKey: 'user_id' });
Teacher.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Student
User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

// Teacher <-> Subject (Many-to-Many with Commission)
Teacher.belongsToMany(Subject, { through: TeacherSubject, foreignKey: 'teacher_id' });
Subject.belongsToMany(Teacher, { through: TeacherSubject, foreignKey: 'subject_id' });

// Student <-> Subject (Many-to-Many Enrollment)
Student.belongsToMany(Subject, { through: StudentSubject, foreignKey: 'student_id' });
Subject.belongsToMany(Student, { through: StudentSubject, foreignKey: 'subject_id' });

// Timetable
Subject.hasMany(Timetable, { foreignKey: 'subject_id' });
Timetable.belongsTo(Subject, { foreignKey: 'subject_id' });

Teacher.hasMany(Timetable, { foreignKey: 'teacher_id' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// Payments
Student.hasMany(Payment, { foreignKey: 'student_id' });
Payment.belongsTo(Student, { foreignKey: 'student_id' });

// Change Requests
Teacher.hasMany(ChangeRequest, { foreignKey: 'teacher_id' });
ChangeRequest.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// Teacher Payouts
Teacher.hasMany(TeacherPayout, { foreignKey: 'teacher_id' });
TeacherPayout.belongsTo(Teacher, { foreignKey: 'teacher_id' });

const db = {
    sequelize,
    User,
    Teacher,
    Student,
    Subject,
    TeacherSubject,
    StudentSubject,
    Timetable,
    Payment,
    Payment,
    ChangeRequest,
    TeacherPayout
};

module.exports = db;
