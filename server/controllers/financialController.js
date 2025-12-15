const { Payment, User, Student, Teacher, Subject, TeacherSubject, StudentSubject, TeacherPayout } = require('../models');
const { Op } = require('sequelize');

// Record a student payment
const createPayment = async (req, res) => {
    // req.body: { student_id, month, year, amount }
    // Logic: calculate total due based on enrolled subjects.
    // Spec: "Student Payment = sum of tuition fees". "Track monthly tuition".
    // "Payment status: Paid / Unpaid". "Stores how much each student pays".

    // Simplification: Manager enters amount paid. System checks against Due.
    const { student_id, month, year, amount_paid } = req.body;
    try {
        // Calculate Total Due
        // Find subjects where student is enrolled BEFORE this month? Or currently enrolled?
        // Assuming current enrollment applies to month.
        const student = await Student.findByPk(student_id, {
            include: [Subject]
        });

        let totalDue = 0;
        student.Subjects.forEach(sub => {
            totalDue += sub.tuition_fee;
        });

        // Check if payment record exists
        let payment = await Payment.findOne({
            where: { student_id, month, year }
        });

        if (payment) {
            payment.total_paid += parseFloat(amount_paid);
            if (payment.total_paid >= payment.total_due) payment.status = 'paid';
            else payment.status = 'partially_paid';
            await payment.save();
        } else {
            payment = await Payment.create({
                student_id,
                month,
                year,
                total_due: totalDue,
                total_paid: parseFloat(amount_paid),
                status: (parseFloat(amount_paid) >= totalDue) ? 'paid' : (parseFloat(amount_paid) > 0 ? 'partially_paid' : 'unpaid')
            });
        }

        res.json(payment);
    } catch (e) { console.error(e); res.status(500).json(e); }
};

// Teacher Earnings Report
// "Teacher Earnings = (Subject price * Number of Students) * Commission %"
const getTeacherEarnings = async (req, res) => {
    const { month, year } = req.query; // If needed to filter by active students in that month
    try {
        const teachers = await Teacher.findAll({
            include: [
                {
                    model: Subject,
                    include: [Student] // To count students
                },
                {
                    model: TeacherPayout, // To see if they were paid
                    required: false,
                    where: { month: month || new Date().getMonth() + 1, year: year || new Date().getFullYear() }
                }
            ]
        });

        const report = teachers.map(t => {
            let totalEarned = 0;
            const breakdown = t.Subjects.map(s => {
                const studentCount = s.Students.length; // Active count
                const revenue = s.tuition_fee * studentCount;
                const commissionRate = s.TeacherSubject.commission_rate;
                const earning = revenue * commissionRate;
                totalEarned += earning;
                return {
                    subject: s.subject_name,
                    students: studentCount,
                    revenue,
                    commission_rate: commissionRate,
                    earning
                };
            });

            return {
                teacher_id: t.teacher_id,
                name: t.name,
                total_earnings: totalEarned,
                breakdown,
                payout_status: t.TeacherPayouts.length > 0 ? t.TeacherPayouts[0] : null
            };
        });

        res.json(report);
    } catch (e) { console.error(e); res.status(500).json(e); }
};

// Get Monthly Financial Report (Overall)
const getMonthlyReport = async (req, res) => {
    // Total Revenue Expected vs Collected
    // School Share vs Teacher Share
    // ...
    // For MVP, just return the aggregated numbers from the logic above.
    res.json({ message: "Not fully implemented yet, use teacher earnings and student payments APIs" });
};

module.exports = { createPayment, getTeacherEarnings, getMonthlyReport };
