const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  },
  servingSize: {
    type: Number,
    required: true
  },
  servingUnit: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['protein', 'carb', 'fat', 'vegetable', 'fruit', 'dairy', 'other'],
    required: true
  }
});

module.exports = mongoose.model('Food', foodSchema); 