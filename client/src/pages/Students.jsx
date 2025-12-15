import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Edit, Trash2 } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({});
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const fetchStudents = async () => {
        const res = await client.get('/students');
        setStudents(res.data);
    };
    const fetchSubjects = async () => {
        const res = await client.get('/subjects');
        setSubjects(res.data);
    };

    useEffect(() => { fetchStudents(); fetchSubjects(); }, []);

    const toggleSubject = (id) => {
        if (selectedSubjects.includes(id)) setSelectedSubjects(selectedSubjects.filter(s => s !== id));
        else setSelectedSubjects([...selectedSubjects, id]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, subjects: selectedSubjects };
            if (form.student_id) {
                await client.put(`/students/${form.student_id}`, form);
            } else {
                await client.post('/students', payload);
            }
            setIsModalOpen(false);
            setForm({});
            setSelectedSubjects([]);
            fetchStudents();
        } catch (e) { alert('Error saving student'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete student?')) return;
        await client.delete(`/students/${id}`);
        fetchStudents();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Students</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Student</button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Level</th>
                            <th style={{ padding: '1rem' }}>Subjects</th>
                            <th style={{ padding: '1rem' }}>Phone</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s.student_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{s.name}</td>
                                <td style={{ padding: '1rem' }}>{s.level}</td>
                                <td style={{ padding: '1rem' }}>{s.Subjects?.map(sub => sub.subject_name).join(', ')}</td>
                                <td style={{ padding: '1rem' }}>{s.phone}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => { setForm(s); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginRight: 10 }}><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(s.student_id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{form.student_id ? 'Edit' : 'Add'} Student</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                            <div className="form-group"><label className="label">Name</label><input className="input" required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Level</label><input className="input" required value={form.level || ''} onChange={e => setForm({ ...form, level: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Phone</label><input className="input" required value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Parent Phone</label><input className="input" value={form.parent_phone || ''} onChange={e => setForm({ ...form, parent_phone: e.target.value })} /></div>

                            {!form.student_id && (
                                <>
                                    <div className="form-group"><label className="label">Username</label><input className="input" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
                                    <div className="form-group"><label className="label">Password</label><input className="input" type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                                </>
                            )}

                            <h3>Enroll in Subjects</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {subjects.map(s => (
                                    <label key={s.subject_id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input type="checkbox" checked={selectedSubjects.includes(s.subject_id)} onChange={() => toggleSubject(s.subject_id)} />
                                        {s.subject_name} ({s.tuition_fee} DH)
                                    </label>
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

export default Students;
