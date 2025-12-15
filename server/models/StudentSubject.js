const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Junction table: Student <-> Subject
const StudentSubject = sequelize.define('StudentSubject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    enrollment_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
});

module.exports = StudentSubject;
