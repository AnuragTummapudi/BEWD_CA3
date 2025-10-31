// utils/store.js
const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, '..', 'data', 'recipes.json');

async function readRecipes() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(txt || '[]');
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    return [];
  }
}

async function writeRecipes(recipes) {
  try {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf8');
  } catch (err) {
    throw err;
  }
}

module.exports = { readRecipes, writeRecipes };