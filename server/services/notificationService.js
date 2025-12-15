// Stub for WhatsApp notifications
// Use Twilio or similar in production

const sendWhatsApp = (phone, message) => {
    console.log(`[WhatsApp Simulation] To: ${phone} | Msg: ${message}`);
    // In future: call Twilio API
};

const notifyStudents = (students, message) => {
    students.forEach(s => sendWhatsApp(s.phone, message));
};

module.exports = { sendWhatsApp, notifyStudents };
