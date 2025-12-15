import React, { useEffect, useState } from 'react';
import client from '../api/client';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES = ['18:00', '19:00', '20:00', '21:00']; // Example Night Class slots

const Timetable = () => {
    const [entries, setEntries] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ day_of_week: 'Monday', start_time: '18:00', end_time: '19:00', class_level: '4ème' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = user.role === 'manager';

    const fetchData = async () => {
        const [eRes, sRes, tRes] = await Promise.all([
            client.get('/timetable'),
            client.get('/subjects'),
            client.get('/teachers')
        ]);
        setEntries(eRes.data);
        setSubjects(sRes.data);
        setTeachers(tRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post('/timetable', form);
            setIsModalOpen(false);
            fetchData();
        } catch (e) { alert('Error adding class'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete class?')) return;
        try {
            await client.delete(`/timetable/${id}`);
            fetchData();
        } catch (e) { alert('Error deleting class'); }
    };

    // Grid Render Helper
    const renderCell = (day, time) => {
        const entry = entries.find(e => e.day_of_week === day && e.start_time === time);
        // Note: Simplistic matching. Overlaps not handled visually yet.
        if (entry) {
            return (
                <div style={{ background: '#e0e7ff', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid var(--primary)' }}>
                    <div style={{ fontWeight: 'bold' }}>{entry.Subject?.subject_name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{entry.Teacher?.name}</div>
                    <div style={{ fontSize: '0.7rem' }}>{entry.room} | {entry.class_level}</div>
                    {isManager && <button onClick={() => handleDelete(entry.timetable_id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontSize: '0.7rem', marginTop: '2px' }}>[x]</button>}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Timetable</h1>
                {isManager && <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Class</button>}
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.5rem' }}>Time / Day</th>
                            {DAYS.map(d => <th key={d} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>{d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {TIMES.map(time => (
                            <tr key={time}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', borderRight: '1px solid var(--border)' }}>{time}</td>
                                {DAYS.map(day => (
                                    <td key={`${day}-${time}`} style={{ padding: '0.5rem', border: '1px solid var(--border)', height: '100px', verticalAlign: 'top', width: '15%' }}>
                                        {renderCell(day, time)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h2>Add Class</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                            <div className="form-group"><label className="label">Day</label>
                                <select className="input" value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })}>
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}><label className="label">Start</label><select className="input" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}>{TIMES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                                <div style={{ flex: 1 }}><label className="label">End</label><select className="input" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}>{TIMES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                            </div>
                            <div className="form-group"><label className="label">Level</label><input className="input" required value={form.class_level} onChange={e => setForm({ ...form, class_level: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Room</label><input className="input" required value={form.room || ''} onChange={e => setForm({ ...form, room: e.target.value })} /></div>
                            <div className="form-group"><label className="label">Subject</label>
                                <select className="input" required value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label className="label">Teacher</label>
                                <select className="input" value={form.teacher_id || ''} onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-primary" style={{ flex: 1 }}>Add</button>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetable;
