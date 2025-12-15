import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Edit, Trash2, Calendar } from 'lucide-react';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({});
    const [selectedSubjects, setSelectedSubjects] = useState([]); // Array of IDs
    // Commission rates: { subject_id: rate }
    const [commissionRates, setCommissionRates] = useState({});

    const fetchTeachers = async () => {
        const res = await client.get('/teachers');
        setTeachers(res.data);
    };

    const fetchSubjects = async () => {
        const res = await client.get('/subjects');
        setSubjects(res.data);
    };

    useEffect(() => { fetchTeachers(); fetchSubjects(); }, []);

    const toggleSubject = (id) => {
        if (selectedSubjects.includes(id)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== id));
            const newRates = { ...commissionRates };
            delete newRates[id];
            setCommissionRates(newRates);
        } else {
            setSelectedSubjects([...selectedSubjects, id]);
            setCommissionRates({ ...commissionRates, [id]: 0.5 }); // Default 50%
        }
    };

    const handleRateChange = (id, val) => {
        setCommissionRates({ ...commissionRates, [id]: parseFloat(val) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, subjects: selectedSubjects, commission_rates: commissionRates };
        try {
            if (form.teacher_id) {
                // Update logic (Not fully implemented in backend for updating subjects, but simple fields yes)
                await client.put(`/teachers/${form.teacher_id}`, form);
            } else {
                await client.post('/teachers', payload);
            }
            setIsModalOpen(false);
            setForm({});
            setSelectedSubjects([]);
            setCommissionRates({});
            fetchTeachers();
        } catch (e) { alert('Error saving teacher'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete teacher?')) return;
        await client.delete(`/teachers/${id}`);
        fetchTeachers();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Teachers</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Teacher</button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Phone</th>
                            <th style={{ padding: '1rem' }}>Subjects</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(t => (
                            <tr key={t.teacher_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{t.name}</td>
                                <td style={{ padding: '1rem' }}>{t.phone}</td>
                                <td style={{ padding: '1rem' }}>{t.Subjects?.map(s => s.subject_name).join(', ')}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => { setForm(t); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginRight: 10 }}><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(t.teacher_id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{form.teacher_id ? 'Edit' : 'Add'} Teacher</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                            <div className="form-group"><label className="label">Name</label><input className="input" required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Phone</label><input className="input" required value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Email</label><input className="input" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>

                            {!form.teacher_id && (
                                <>
                                    <div className="form-group"><label className="label">Username</label><input className="input" required value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
                                    <div className="form-group"><label className="label">Password</label><input className="input" required type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                                </>
                            )}

                            <h3>Assign Subjects</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {subjects.map(s => (
                                    <div key={s.subject_id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input type="checkbox" checked={selectedSubjects.includes(s.subject_id)} onChange={() => toggleSubject(s.subject_id)} />
                                        <span>{s.subject_name}</span>
                                        {selectedSubjects.includes(s.subject_id) && (
                                            <input
                                                type="number"
                                                step="0.1"
                                                style={{ width: '60px', marginLeft: 'auto' }}
                                                value={commissionRates[s.subject_id] || ''}
                                                onChange={(e) => handleRateChange(s.subject_id, e.target.value)}
                                                placeholder="Rate"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
