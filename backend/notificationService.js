const Notification = require('./models/Notification');

const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ user: userId, message });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };