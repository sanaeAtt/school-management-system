const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
    teacher_id: {
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
    email: {
        type: DataTypes.STRING,
        allowNull: true // Optional as per spec "Teacher contact information"
    },
    // Linking to User for auth
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Can be null if created before account
    }
});

module.exports = Teacher;
