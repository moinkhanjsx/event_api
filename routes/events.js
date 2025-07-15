const express = require('express');
const router = express.Router();
const { Event, User, Registration } = require('../models');

// Create Event
router.post('/', async (req, res) => {
  try {
    const { title, date_time, location, capacity } = req.body;
    // Validate input
    const parsedCapacity = Number(capacity);
    if (!title || !date_time || !location || !capacity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (isNaN(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 1000) {
      return res.status(400).json({ error: 'Capacity must be a number between 1 and 1000.' });
    }
    const event = await Event.create({ title, date_time, location, capacity: parsedCapacity });
    return res.status(201).json({ eventId: event.id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});

// List Upcoming Events
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.findAll({
      where: { date_time: { [require('sequelize').Op.gt]: now } },
      order: [
        ['date_time', 'ASC'],
        ['location', 'ASC']
      ]
    });
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list upcoming events', details: err.message });
  }
});

// Get Event Details
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, as: 'users', attributes: ['id', 'name', 'email'], through: { attributes: [] } }]
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
});

// Register for Event
router.post('/:id/register', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, as: 'users' }]
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    // Check if event is in the past
    if (new Date(event.date_time) < new Date()) {
      return res.status(400).json({ error: 'Cannot register for past events' });
    }
    // Check if event is full
    if (event.users.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    // Check for duplicate registration
    const alreadyRegistered = event.users.some(u => u.id === userId);
    if (alreadyRegistered) {
      return res.status(400).json({ error: 'User already registered for this event' });
    }
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Registration.create({ userId, eventId: event.id });
    return res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to register', details: err.message });
  }
});

// Cancel Registration
router.post('/:id/cancel', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const registration = await Registration.findOne({ where: { userId, eventId: event.id } });
    if (!registration) {
      return res.status(400).json({ error: 'User is not registered for this event' });
    }
    await registration.destroy();
    return res.json({ message: 'Registration cancelled' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to cancel registration', details: err.message });
  }
});

// Event Stats
router.get('/:id/stats', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, as: 'users', attributes: ['id'], through: { attributes: [] } }]
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const totalRegistrations = event.users.length;
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);
    return res.json({
      totalRegistrations,
      remainingCapacity,
      percentUsed: Number(percentUsed)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get event stats', details: err.message });
  }
});

// Create User (helper endpoint)
router.post('/user', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const user = await User.create({ name, email });
    return res.status(201).json({ userId: user.id });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

module.exports = router; 