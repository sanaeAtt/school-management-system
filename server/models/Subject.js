const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
    subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tuition_fee: {
        type: DataTypes.FLOAT, // Spec says "Subject Fee (price)"
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Subject;
