import React, { useEffect, useState } from 'react';
import client from '../api/client';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({ title: '', message: '', request_type: 'schedule' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = user.role === 'manager';
    const isTeacher = user.role === 'teacher';

    const fetchRequests = () => {
        client.get('/requests').then(res => setRequests(res.data));
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Need current teacher ID.
            // Assumption: Backend infers it, or we pass it if we have it in user object.
            // User object has { id, role, teacher_id? } if we modified login controller correctly.
            // Yes, I modified login controller to return { ...payload, teacher_id: ... }.

            await client.post('/requests', { ...form, teacher_id: user.teacher_id });
            alert('Request sent');
            setForm({ title: '', message: '', request_type: 'schedule' });
            fetchRequests();
        } catch (e) { alert('Error sending request'); }
    };

    const handleAction = async (id, status) => {
        try {
            await client.put(`/requests/${id}`, { status });
            fetchRequests();
        } catch (e) { alert('Error updating status'); }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: isTeacher ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            {isTeacher && (
                <div>
                    <h1>Submit Request</h1>
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Type</label>
                                <select className="input" value={form.request_type} onChange={e => setForm({ ...form, request_type: e.target.value })}>
                                    <option value="schedule">Schedule Change</option>
                                    <option value="commission">Commission Issue</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">Title</label>
                                <input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="label">Message</label>
                                <textarea className="input" rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                            </div>
                            <button className="btn btn-primary">Send</button>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <h1>{isManager ? 'Incoming Requests' : 'My Requests'}</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {requests.map(r => (
                        <div key={r.request_id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>{r.title} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({r.request_type})</span></h3>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                    background: r.status === 'approved' ? '#dcfce7' : r.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                    color: r.status === 'approved' ? '#166534' : r.status === 'rejected' ? '#991b1b' : '#92400e'
                                }}>
                                    {r.status.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ margin: '0.5rem 0' }}>{r.message}</p>
                            {isManager && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From: {r.Teacher?.name}</p>
                            )}

                            {isManager && r.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                    <button className="btn btn-primary" onClick={() => handleAction(r.request_id, 'approved')}>Approve</button>
                                    <button className="btn btn-danger" onClick={() => handleAction(r.request_id, 'rejected')}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                    {requests.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No requests found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Requests;
