const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    level: {
        type: DataTypes.STRING, // e.g., '4ème', '3ème'
        allowNull: false
    },
    // Linking to User for auth
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Student;
