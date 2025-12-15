import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Users, BookOpen, DollarSign, Clock } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ teachers: 0, students: 0, subjects: 0, revenue: 0 });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Only Manager sees full stats? "Dashboard (Manager Only)"
    // Teacher sees their schedule?
    // I'll stick to Manager view for now based on prompt "How to Divide the App... Dashboard (Manager Only)".

    useEffect(() => {
        if (user.role === 'manager') {
            const fetchData = async () => {
                try {
                    const [tRes, sRes, subRes] = await Promise.all([
                        client.get('/teachers'),
                        client.get('/students'),
                        client.get('/subjects')
                    ]);
                    setStats({
                        teachers: tRes.data.length,
                        students: sRes.data.length,
                        subjects: subRes.data.length,
                        revenue: 0 // TODO: Fetch from financials
                    });
                } catch (e) { console.error(e); }
            };
            fetchData();
        }
    }, [user.role]);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '50%', background: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user.username}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Students" value={stats.students} icon={Users} color="#4f46e5" />
                <StatCard title="Total Teachers" value={stats.teachers} icon={Users} color="#10b981" />
                <StatCard title="Active Subjects" value={stats.subjects} icon={BookOpen} color="#f59e0b" />
                <StatCard title="Monthly Revenue" value={`${stats.revenue} DH`} icon={DollarSign} color="#ef4444" />
            </div>

            {/* TODO warning: Teachers absent, Change requests */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3>Recent Change Requests</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No pending requests.</p>
                </div>
                <div className="card">
                    <h3>Today's Classes</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No classes scheduled today.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
