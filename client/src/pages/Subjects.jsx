import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Trash2, Edit } from 'lucide-react';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ subject_name: '', tuition_fee: '', description: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = user.role === 'manager';

    const fetchSubjects = async () => {
        const res = await client.get('/subjects');
        setSubjects(res.data);
    };

    useEffect(() => { fetchSubjects(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.subject_id) {
                await client.put(`/subjects/${form.subject_id}`, form);
            } else {
                await client.post('/subjects', form);
            }
            setIsModalOpen(false);
            setForm({ subject_name: '', tuition_fee: '', description: '' });
            fetchSubjects();
        } catch (e) {
            alert('Error saving subject');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await client.delete(`/subjects/${id}`);
            fetchSubjects();
        } catch (e) { alert('Error deleting subject'); }
    };

    const openEdit = (sub) => {
        setForm(sub);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Subjects</h1>
                {isManager && (
                    <button className="btn btn-primary" onClick={() => { setForm({}); setIsModalOpen(true); }}>
                        + Add Subject
                    </button>
                )}
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Monthly Fee</th>
                            <th style={{ padding: '1rem' }}>Description</th>
                            {isManager && <th style={{ padding: '1rem' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(sub => (
                            <tr key={sub.subject_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{sub.subject_name}</td>
                                <td style={{ padding: '1rem' }}>{sub.tuition_fee} DH</td>
                                <td style={{ padding: '1rem' }}>{sub.description}</td>
                                {isManager && (
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => openEdit(sub)} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginRight: '10px' }}><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(sub.subject_id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Trash2 size={18} /></button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h2>{form.subject_id ? 'Edit' : 'Add'} Subject</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label className="label">Subject Name</label>
                                <input className="input" required value={form.subject_name || ''} onChange={e => setForm({ ...form, subject_name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="label">Tuition Fee (DH)</label>
                                <input type="number" className="input" required value={form.tuition_fee || ''} onChange={e => setForm({ ...form, tuition_fee: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="label">Description</label>
                                <input className="input" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
