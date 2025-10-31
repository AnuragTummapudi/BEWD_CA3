## Advanced Recipe Sharing API

# Local run instructions
1. Ensure you have Node.js installed on your machine.
2. Clone the repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install the necessary dependencies.
5. Start the server with the command `npm start`.

# API URL
The API can be accessed at: `https://bewd-ca3-vsix.onrender.com`

# API Endpoints
- `GET api/recipes`: Retrieve a list of all recipes.   
- `POST api/recipes`: Add a new recipe to the collection.
- `PUT api/recipes/:id`: Update an existing recipe by its ID.  
- `DELETE api/recipes/:id`: Remove a recipe from the collection by its ID.

# Authentication Details
- This API uses basic authentication. Include your API Key in the request headers.
- Example:
    ```
    {   
        "x-api-key":    "YOUR_API_KEY"
    }
    ``` 
# Sample Payloads
- **Add Recipe (POST /api/recipes)**:
    ```json
    {
        "recipeTitle": "Aloo Fry",
        "ingredients": ["Aloo", "Oil", "Jeera", "onion"],
        "instructions": "Pour oil into pan and fry the aloo slowly under low flame.",
        "difficulty": "easy"
    }
    ```
# Github Repository
GitHub Repository Link - https://github.com/AnuragTummapudi/BEWD_CA3.git