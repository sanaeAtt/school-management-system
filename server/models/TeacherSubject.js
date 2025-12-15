const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Junction table: Teacher <-> Subject
const TeacherSubject = sequelize.define('TeacherSubject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    commission_rate: {
        type: DataTypes.FLOAT, // 0.00 - 1.00 (e.g. 0.5 for 50%)
        allowNull: false,
        defaultValue: 0.0
    }
});

module.exports = TeacherSubject;
