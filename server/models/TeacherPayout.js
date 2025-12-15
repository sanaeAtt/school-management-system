const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherPayout = sequelize.define('TeacherPayout', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    status: {
        type: DataTypes.ENUM('paid', 'unpaid'),
        defaultValue: 'unpaid'
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = TeacherPayout;
