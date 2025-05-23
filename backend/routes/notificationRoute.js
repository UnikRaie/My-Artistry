const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth= require('../middleware/auth.js');
// Route to fetch notifications for a user
router.get('/notifications',auth, async (req, res) => {
  try {
    const userId = req.userId; 

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});


// Mark a notification as read
router.post('/notifications/markAsRead', auth, async (req, res) => {
    try {
      const { id } = req.body;
  
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).send('Notification not found');
      }
  
      notification.read = true;
      await notification.save();
  
      res.send({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
  // Clear all notifications for a user
router.post('/notifications/clearAll', auth, async (req, res) => {
    try {
      const userId = req.userId; // Assuming auth middleware attaches user id to req.user
  
      await Notification.deleteMany({ user: userId });
  
      res.send({ message: 'All notifications cleared' });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
module.exports = router;
