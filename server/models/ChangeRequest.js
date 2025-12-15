const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChangeRequest = sequelize.define('ChangeRequest', {
    request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    request_type: {
        type: DataTypes.STRING, // 'schedule', 'commission', etc.
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    resolved_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = ChangeRequest;
