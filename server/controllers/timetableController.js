const { Timetable, Subject, Teacher } = require('../models');

const createEntry = async (req, res) => {
    try {
        const entry = await Timetable.create(req.body);
        res.status(201).json(entry);
    } catch (e) { res.status(500).json(e); }
};

const getTimetable = async (req, res) => {
    try {
        const schedule = await Timetable.findAll({
            include: [Subject, Teacher]
        });
        res.json(schedule);
    } catch (e) { res.status(500).json(e); }
};

const updateEntry = async (req, res) => {
    const { id } = req.params;
    try {
        await Timetable.update(req.body, { where: { timetable_id: id } });
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json(e); }
};

const deleteEntry = async (req, res) => {
    const { id } = req.params;
    try {
        await Timetable.destroy({ where: { timetable_id: id } });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json(e); }
};

module.exports = { createEntry, getTimetable, updateEntry, deleteEntry };
