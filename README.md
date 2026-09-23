# Tatva -- Ingredient Simplifier

> **Know Your Food. Trust What You Eat.**

Tatva is an AI-powered food inspection and ingredient analysis
application designed to help users understand what is inside packaged
food products. Users can upload an image of an ingredient list, and the
application analyzes the ingredients to identify potentially harmful
ingredients, allergens, and other important food-related information.

## ✨ Features

-   🔐 **User Authentication** -- Secure login and signup experience.
-   📷 **Ingredient Image Upload** -- Upload a clear image of the
    ingredient list from food packaging.
-   🤖 **AI-Powered Analysis** -- Uses AI vision capabilities to read
    and analyze ingredient information from an image.
-   🧪 **Ingredient Classification** -- Classifies detected ingredients
    into categories such as safe, moderate, allergen, or high-risk.
-   ⚠️ **Risk Detection** -- Highlights potentially harmful or high-risk
    ingredients.
-   🌾 **Allergen Detection** -- Identifies common allergens such as
    wheat/gluten and soy.
-   📊 **Detailed Results** -- Displays ingredient-wise status, harmful
    ingredients, allergens, and additional notes.
-   💡 **Recommendations** -- Provides an easy-to-understand summary to
    help users interpret the product.
-   🕒 **Analysis History** -- Allows users to access previous product
    analysis results.

## 🖥️ Application Flow

``` text
User Login / Signup
        ↓
Upload Ingredient Image
        ↓
AI Vision Analysis
        ↓
Ingredient Extraction
        ↓
Risk & Allergen Identification
        ↓
Detailed Analysis Result
        ↓
Recommendation
```

## 📸 Screenshots

### Login

![Tatva Login](screenshots/login.png)

### Upload Ingredient List

![Ingredient Upload](screenshots/upload.png)

### Analysis Result

![Analysis Result](screenshots/result.png)

> Add the three screenshots to a `screenshots/` folder in the repository
> using the names shown above.

## 🛠️ Tech Stack

### Frontend

-   React.js
-   TypeScript
-   Vite
-   CSS

### Backend

-   Node.js
-   Express.js
-   REST APIs

### AI

-   Google Gemini Vision / Generative AI

### Authentication

-   JWT-based authentication

### Database

-   MongoDB

## 📁 Project Structure

``` text
Tatva-Ingredient-Simplifier/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── login.png
│   ├── upload.png
│   └── result.png
│
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

``` bash
git clone https://github.com/tree120/tatva-ingredient-simplifier.git
cd tatva-ingredient-simplifier
```

### 2. Set up the frontend

``` bash
cd Frontend
npm install
npm run dev
```

The Vite development server will start on the local development URL
shown in the terminal.

### 3. Set up the backend

Open another terminal:

``` bash
cd backend
npm install
npm run dev
```

If the backend uses a different start script, use the script defined in
`backend/package.json`.

### 4. Configure environment variables

Create a `.env` file in the backend directory and add the required
configuration for:

``` text
Database connection
JWT secret
Gemini / Google AI API key
Other application secrets
```

**Do not commit `.env` files or API keys to GitHub.** Add `.env` to
`.gitignore`.

## 🔍 How the AI Analysis Works

1.  The user uploads an image containing the product's ingredient list.
2.  The backend sends the image to the AI vision model.
3.  The model interprets the visible ingredient information.
4.  Ingredients are extracted and analyzed.
5.  Potentially harmful ingredients and allergens are identified.
6.  The application assigns an understandable status to the ingredients.
7.  The frontend displays the analysis in a structured result page.
8.  The user receives additional notes and a product recommendation.

## 🧾 Example Analysis

The result page can provide information such as:

  Ingredient         Status
  ------------------ ----------
  Wholegrain Wheat   Safe
  Plain Chocolate    Moderate
  Sugar              Moderate
  Cocoa Mass         Safe
  Cocoa Butter       Safe
  Soya Lecithin      Allergen
  Flavouring         Moderate
  Salt               Safe

The application can also highlight:

-   **Harmful / high-risk ingredients**
-   **Allergen information**
-   **Additional product notes**
-   **Overall recommendation**

## 🔐 Security

-   Authentication is handled using JWT.
-   Sensitive credentials are stored in environment variables.
-   API keys should never be hard-coded in the frontend.
-   `.env` files should be excluded using `.gitignore`.

## 🎯 Project Objective

The goal of Tatva is to make food labels easier to understand by
converting a complicated ingredient list into clear, structured
information that users can quickly interpret.

## ⚠️ Disclaimer

Tatva is an informational food-analysis tool. Its results should not be
treated as medical advice or as a replacement for professional dietary
or medical guidance. AI-generated analysis may contain errors,
especially when the uploaded ingredient image is unclear.

## 👩‍💻 Author

**Sweta Kumari**

GitHub: https://github.com/tree120

------------------------------------------------------------------------

### Future Improvements

-   Barcode scanning
-   Product database integration
-   Personalized dietary preferences
-   More detailed nutritional analysis
-   Multi-language ingredient analysis
-   Improved OCR and image quality handling
-   Product comparison
