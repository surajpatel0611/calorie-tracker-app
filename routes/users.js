const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, height, weight, age, gender, activityLevel, goal } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust calories based on goal
    let dailyCalories;
    switch (goal) {
      case 'lose':
        dailyCalories = tdee - 500; // 500 calorie deficit
        break;
      case 'gain':
        dailyCalories = tdee + 500; // 500 calorie surplus
        break;
      default:
        dailyCalories = tdee;
    }

    // Calculate macros (40/30/30 split)
    const macros = {
      protein: Math.round((dailyCalories * 0.3) / 4), // 4 calories per gram
      carbs: Math.round((dailyCalories * 0.4) / 4),   // 4 calories per gram
      fats: Math.round((dailyCalories * 0.3) / 9)     // 9 calories per gram
    };

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
      height,
      weight,
      age,
      gender,
      activityLevel,
      goal,
      dailyCalories,
      macros
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        dailyCalories: user.dailyCalories,
        macros: user.macros
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        dailyCalories: user.dailyCalories,
        macros: user.macros
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user macros
router.put('/macros/:userId', async (req, res) => {
  try {
    const { dailyCalories, macros } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { dailyCalories, macros },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 