// routes/reviews.js
const express = require('express');
const router = express.Router();
const { readRecipes, writeRecipes } = require('../utils/store');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { recipeTitle, ingredients, instructions , cookTime, difficulty, tags} = req.body;
    if (!recipeTitle || !ingredients || !instructions || !cookTime) {
      return res.status(400).json({ error: 'recipeTitle, ingredients, instructions and cookTime are required.' });
    }
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags must be an array.' });
    }
    if (!['easy', 'medium', 'hard'].includes(req.body.difficulty || 'medium')) {
      return res.status(400).json({ error: 'difficulty must be one of easy, medium, hard.' });
    }

    const recipes = await readRecipes();

    const duplicate = recipes.find(r => r.recipeTitle === recipeTitle && r.userId === req.user.id);
    if (duplicate) {
      return res.status(409).json({ error: 'You have already submitted a recipe with this title.' });
    }

    const recipe = {
      id: uuidv4(),
      recipeTitle,
      ingredients,
      instructions,
      cookTime,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      difficulty: difficulty || 'medium',
      userId: req.user.id,
      username: req.user.username || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    recipes.push(recipe);
    await writeRecipes(recipes);
    return res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { recipeTitle, ingredients, instructions, cookTime, tags, difficulty } = req.query;
    let recipes = await readRecipes();

    if (recipeTitle) {
      recipes = recipes.filter(r => r.recipeTitle.toLowerCase().includes(recipeTitle.toLowerCase()));
    }
    if (ingredients) {
      recipes = recipes.filter(r => r.ingredients.toLowerCase().includes(ingredients.toLowerCase()));
    }
    if (instructions) {
      recipes = recipes.filter(r => r.instructions.toLowerCase().includes(instructions.toLowerCase()));
    }
    if (cookTime) {
      recipes = recipes.filter(r => r.cookTime === cookTime);
    }
    if (tags) {
      recipes = recipes.filter(r => r.tags.some(t => t.toLowerCase().includes(tags.toLowerCase())));
    }
    if (difficulty) {
      recipes = recipes.filter(r => r.difficulty === difficulty);
    }

    const sort = req.query.sort;
    if (sort) {
      const [field, order] = sort.split('_');
      const dir = order === 'desc' ? -1 : 1;
      if (field === 'rating') {
        recipes.sort((a,b) => (a.rating - b.rating) * dir);
      } else if (field === 'date' || field === 'createdAt') {
        recipes.sort((a,b) => (new Date(a.createdAt) - new Date(b.createdAt)) * dir);
      }
    }

    return res.json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { recipeTitle, ingredients, instructions, cookTime, tags, difficulty } = req.body;

    const recipes = await readRecipes();
    const idx = recipes.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Recipe not found.' });

    const recipe = recipes[idx];
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe.' });
    }

    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (tags !== undefined) recipe.tags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    if (difficulty !== undefined) recipe.difficulty = difficulty;

    recipe.updatedAt = new Date().toISOString();

    recipes[idx] = recipe;
    await writeRecipes(recipes);
    return res.json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    let recipes = await readRecipes();
    const idx = recipes.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Recipe not found.' });

    const recipe = recipes[idx];

    // Only owner or admin
    if (recipe.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to delete this recipe.' });
    }

    recipes.splice(idx, 1);
    await writeRecipes(recipes);
    return res.json({ message: 'Recipe deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;