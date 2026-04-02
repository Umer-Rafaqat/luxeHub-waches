const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Optional auth middleware - attaches user if token present, but doesn't block
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch { /* ignore invalid token */ }
  }
  next();
};

// POST /api/orders — supports both guest and authenticated users
router.post('/', optionalAuth, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice, guestInfo } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items' });

  const orderData = { items, shippingAddress, paymentMethod, totalPrice };
  if (req.user) {
    orderData.user = req.user._id;
  } else {
    if (!guestInfo?.name || !guestInfo?.email) {
      return res.status(400).json({ message: 'Guest name and email are required' });
    }
    orderData.guestInfo = guestInfo;
  }

  const order = await Order.create(orderData);
  res.status(201).json(order);
}));

// GET /api/orders/mine
router.get('/mine', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

module.exports = router;
