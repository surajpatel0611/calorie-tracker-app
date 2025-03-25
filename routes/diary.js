const express = require('express');
const router = express.Router();
const FoodDiary = require('../models/FoodDiary');
const Food = require('../models/Food');

// Get user's diary for a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const startOfDay = new Date(req.params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.params.date);
    endOfDay.setHours(23, 59, 59, 999);

    const diary = await FoodDiary.findOne({
      userId: req.params.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!diary) {
      return res.json({
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
      });
    }

    res.json(diary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add food to diary
router.post('/:userId', async (req, res) => {
  try {
    const { mealType, foodId, quantity, unit } = req.body;
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Calculate nutritional values based on quantity
    const multiplier = quantity / food.servingSize;
    const calories = food.calories * multiplier;
    const protein = food.protein * multiplier;
    const carbs = food.carbs * multiplier;
    const fats = food.fats * multiplier;

    // Get or create diary entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let diary = await FoodDiary.findOne({
      userId: req.params.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!diary) {
      diary = new FoodDiary({
        userId: req.params.userId,
        date: today,
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
      });
    }

    // Find or create meal type
    let meal = diary.meals.find(m => m.type === mealType);
    if (!meal) {
      meal = { type: mealType, foods: [] };
      diary.meals.push(meal);
    }

    // Add food to meal
    meal.foods.push({
      foodId,
      quantity,
      unit
    });

    // Update totals
    diary.totalCalories += calories;
    diary.totalProtein += protein;
    diary.totalCarbs += carbs;
    diary.totalFats += fats;

    await diary.save();
    res.json(diary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove food from diary
router.delete('/:userId/:foodId', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diary = await FoodDiary.findOne({
      userId: req.params.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!diary) {
      return res.status(404).json({ message: 'Diary entry not found' });
    }

    // Find and remove food from all meals
    for (let meal of diary.meals) {
      const foodIndex = meal.foods.findIndex(f => f.foodId.toString() === req.params.foodId);
      if (foodIndex !== -1) {
        const food = await Food.findById(req.params.foodId);
        const quantity = meal.foods[foodIndex].quantity;
        const multiplier = quantity / food.servingSize;

        // Update totals
        diary.totalCalories -= food.calories * multiplier;
        diary.totalProtein -= food.protein * multiplier;
        diary.totalCarbs -= food.carbs * multiplier;
        diary.totalFats -= food.fats * multiplier;

        meal.foods.splice(foodIndex, 1);
        break;
      }
    }

    await diary.save();
    res.json(diary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 