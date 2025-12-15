const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timetable = sequelize.define('Timetable', {
    timetable_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class_level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    teacher_id: {
        type: DataTypes.INTEGER, // Can be null if not yet assigned? Spec says "Assign teacher for each subject"
        allowNull: true
    },
    day_of_week: {
        type: DataTypes.STRING, // e.g., 'Monday'
        allowNull: false
    },
    start_time: {
        type: DataTypes.STRING, // '18:00'
        allowNull: false
    },
    end_time: {
        type: DataTypes.STRING, // '19:00'
        allowNull: false
    },
    room: { // "List of rooms... For each room, show a timetable"
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Timetable;
