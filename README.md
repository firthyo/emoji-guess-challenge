# Emoji Guess Challenge

A fun and interactive game where you guess movies, books, or games based on emoji sequences! Built with React, TypeScript, and powered by Google's Gemini AI.

## Features

- 🎯 Multiple difficulty levels (Easy, Medium, Hard)
- 💡 Smart hint system with progressive reveals
- 🎮 Score tracking and point system
- 🤖 AI-powered emoji generation and guess validation
- 🎨 Modern UI with Chakra UI components

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## How to Play

1. Start a new game by clicking "New Round"
2. Look at the emoji sequence displayed
3. Type your guess in the input field
4. Use hints if you're stuck (max 3 per round)
5. Score points:
   - 3 points for correct guess without hints
   - 2 points for correct guess with 1 hint
   - 1 point for correct guess with 2-3 hints

## Technologies Used

- React + TypeScript
- Vite
- Chakra UI
- Google Gemini AI
- React Icons
