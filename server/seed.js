const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: false });

        // Check if manager exists
        const managerExists = await User.findOne({ where: { role: 'manager' } });
        if (!managerExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'manager'
            });
            console.log('Manager account created: admin / admin123');
        } else {
            console.log('Manager account already exists');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
