import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, DollarSign, MessageSquare, LogOut, Settings } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>SchoolMgr</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role?.toUpperCase()}</p>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0' }}>
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>

                    {(user.role === 'manager' || user.role === 'teacher') && (
                        <NavLink to="/teachers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Users size={20} /> Teachers
                        </NavLink>
                    )}

                    {(user.role === 'manager') && (
                        <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Users size={20} /> Students
                        </NavLink>
                    )}

                    <NavLink to="/subjects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} /> Subjects
                    </NavLink>

                    <NavLink to="/timetable" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} /> Timetable
                    </NavLink>

                    <NavLink to="/financials" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <DollarSign size={20} /> Financials
                    </NavLink>

                    <NavLink to="/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <MessageSquare size={20} /> Requests
                    </NavLink>
                </nav>

                <div style={{ padding: '1rem' }}>
                    <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
                        <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
                    </button>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
