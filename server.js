// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recipesRouter = require('./routes/recipes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/recipes', recipesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});