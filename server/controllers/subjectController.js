const { Subject } = require('../models');

const createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateSubject = async (req, res) => {
    const { id } = req.params;
    try {
        await Subject.update(req.body, { where: { subject_id: id } });
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json(e); }
};

const deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        await Subject.destroy({ where: { subject_id: id } });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json(e); }
};

module.exports = { createSubject, getSubjects, updateSubject, deleteSubject };
