const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
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
    total_due: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    total_paid: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    status: {
        type: DataTypes.ENUM('paid', 'partially_paid', 'unpaid'),
        defaultValue: 'unpaid'
    }
});

module.exports = Payment;
