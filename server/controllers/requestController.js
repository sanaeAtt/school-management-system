const { ChangeRequest, Teacher } = require('../models');

const createRequest = async (req, res) => {
    try {
        // Teacher creates request
        const { teacher_id } = req.body; // Passed or inferred from user?
        // Ideally inferred from req.user -> teacher like in Auth.
        // For MVP, allow passing it or lookup.
        const request = await ChangeRequest.create(req.body);
        res.status(201).json(request);
    } catch (e) { res.status(500).json(e); }
};

const getRequests = async (req, res) => {
    try {
        const requests = await ChangeRequest.findAll({ include: [Teacher] });
        res.json(requests);
    } catch (e) { res.status(500).json(e); }
};

const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await ChangeRequest.findByPk(id);
        if (!request) return res.status(404).json({ message: 'Not found' });

        request.status = status;
        if (status === 'approved' || status === 'rejected') {
            request.resolved_at = new Date();
        }
        await request.save();

        // Trigger Notification Logic Here (Stub)
        console.log(`Notification: Request ${id} is now ${status}`);

        res.json(request);
    } catch (e) { res.status(500).json(e); }
};

module.exports = { createRequest, getRequests, updateRequestStatus };
