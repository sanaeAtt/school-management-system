import React, { useEffect, useState } from 'react';
import client from '../api/client';

const Financials = () => {
    const [view, setView] = useState('payments'); // 'payments' or 'earnings'
    const [students, setStudents] = useState([]);
    const [earnings, setEarnings] = useState([]);

    // Payment Form
    const [paymentForm, setPaymentForm] = useState({ student_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), amount_paid: '' });

    useEffect(() => {
        if (view === 'payments') {
            client.get('/students').then(res => setStudents(res.data));
        } else {
            client.get('/financials/earnings').then(res => setEarnings(res.data));
        }
    }, [view]);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            await client.post('/financials/payments', paymentForm);
            alert('Payment recorded');
            setPaymentForm({ ...paymentForm, amount_paid: '' });
        } catch (e) { alert('Error recording payment'); }
    };

    return (
        <div>
            <h1>Financials</h1>
            <div style={{ margin: '1rem 0', display: 'flex', gap: '10px' }}>
                <button className={`btn ${view === 'payments' ? 'btn-primary' : ''}`} onClick={() => setView('payments')}>Student Payments</button>
                <button className={`btn ${view === 'earnings' ? 'btn-primary' : ''}`} onClick={() => setView('earnings')}>Teacher Earnings</button>
            </div>

            {view === 'payments' && (
                <div className="card" style={{ maxWidth: '500px' }}>
                    <h2>Record Student Payment</h2>
                    <form onSubmit={handlePayment} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label className="label">Student</label>
                            <select className="input" required value={paymentForm.student_id} onChange={e => setPaymentForm({ ...paymentForm, student_id: e.target.value })}>
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.level})</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label className="label">Month</label>
                                <input type="number" className="input" value={paymentForm.month} onChange={e => setPaymentForm({ ...paymentForm, month: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Year</label>
                                <input type="number" className="input" value={paymentForm.year} onChange={e => setPaymentForm({ ...paymentForm, year: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label">Amount Paid (DH)</label>
                            <input type="number" className="input" required value={paymentForm.amount_paid} onChange={e => setPaymentForm({ ...paymentForm, amount_paid: e.target.value })} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Submit Payment</button>
                    </form>
                </div>
            )}

            {view === 'earnings' && (
                <div className="card">
                    <h2>Teacher Earnings Report (Current Month)</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Teacher</th>
                                <th style={{ padding: '1rem' }}>Total Earnings</th>
                                <th style={{ padding: '1rem' }}>Breakdown</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {earnings.map(t => (
                                <tr key={t.teacher_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{t.name}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{t.total_earnings} DH</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {t.breakdown.map((b, i) => (
                                                <div key={i}>{b.subject}: {b.students} students * {b.commission_rate * 100}% = {b.earning} DH</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {t.payout_status ? <span style={{ color: 'green' }}>Paid</span> : <span style={{ color: 'orange' }}>Unpaid</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Financials;
