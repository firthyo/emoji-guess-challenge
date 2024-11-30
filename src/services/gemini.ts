import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface GameState {
  currentEmojis: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  hintsUsed: number;
  currentAnswer: string;
  recentAnswers: string[];
  attemptsLeft: number;
  hints: string[];  // Store all hints
}

export const generateEmojiSequence = async (difficulty: string, recentAnswers: string[] = [], retryCount = 0): Promise<{ emojis: string; answer: string }> => {
  const maxRetries = 3;
  const mediaType = 'movie';
  
  // Ensure all titles are compared in lowercase
  const normalizedRecentAnswers = recentAnswers.map(a => a.toLowerCase());
  const recentList = normalizedRecentAnswers.map(a => `"${a}"`).join(', ');
  
  try {
    const prompt = `You are generating a ${mediaType} title guessing game.
1. Choose a well-known ${difficulty} ${mediaType} title that is NOT one of these: ${recentList}
2. Create 3-5 UNIQUE emojis that represent that title (DO NOT repeat any emoji)
3. Return ONLY the emojis and title in this format:
EMOJIS: [emojis here]
TITLE: [title in lowercase]

Rules:
- Use well-known, family-friendly movies that most people would recognize
- Choose clear, relevant emojis
- NEVER repeat the same emoji in the sequence
- Keep the emoji sequence simple (3-5 emojis) not more than 5
- Return the title in lowercase
- Avoid any sensitive or controversial content
- NEVER use any of these recently used titles: ${recentList}`;

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const emojiMatch = response.match(/EMOJIS:\s*(.+)/i);
    const titleMatch = response.match(/TITLE:\s*(.+)/i);
    
    if (!emojiMatch || !titleMatch) {
      throw new Error('Invalid response format from AI');
    }
    
    const emojis = emojiMatch[1].trim();
    const title = titleMatch[1].trim().toLowerCase();

    // Verify no duplicate emojis
    const emojiArray = Array.from(emojis.replace(/\s+/g, ''));
    const uniqueEmojis = new Set(emojiArray);
    if (emojiArray.length !== uniqueEmojis.size) {
      console.log('Got duplicate emojis, retrying...');
      return generateEmojiSequence(difficulty, recentAnswers, retryCount);
    }
    
    // Double check the title isn't in recent answers
    if (normalizedRecentAnswers.includes(title)) {
      console.log('Got a repeat title despite instructions, retrying...');
      return generateEmojiSequence(difficulty, recentAnswers, retryCount);
    }
    
    return { emojis, answer: title };
  } catch (error) {
    console.error('Error generating sequence:', error);
    
    // Retry if we haven't hit the max retries
    if (retryCount < maxRetries) {
      console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
      return generateEmojiSequence(difficulty, recentAnswers, retryCount + 1);
    }
    
    // If we've hit max retries, use a fallback movie
    const fallbackMovies = [
      { title: 'star wars', emojis: '🌟⚔️🚀' },
      { title: 'toy story', emojis: '🧸🤠🚀' },
      { title: 'jurassic park', emojis: '🦖🏞️🚙' },
      { title: 'the lion king', emojis: '🦁👑🌅' },
      { title: 'frozen', emojis: '❄️👸🏰' },
      { title: 'finding nemo', emojis: '🐠🌊🔍' },
      { title: 'harry potter', emojis: '⚡🧙‍♂️🪄' },
      { title: 'spider man', emojis: '🕷️🕸️🦸‍♂️' },
      { title: 'the matrix', emojis: '💊🕶️💻' },
      { title: 'jaws', emojis: '🦈🏊‍♂️🚤' }
    ];
    
    // Filter out recently used movies (case-insensitive)
    const availableFallbacks = fallbackMovies.filter(
      movie => !normalizedRecentAnswers.includes(movie.title.toLowerCase())
    );
    
    if (availableFallbacks.length === 0) {
      throw new Error('No available movies to use. Please try again.');
    }
    
    const fallback = availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)];
    return { emojis: fallback.emojis, answer: fallback.title };
  }
};

export const validateGuess = async (guess: string, answer: string): Promise<{ isCorrect: boolean; message?: string }> => {
  // Clean up strings for comparison
  const cleanString = (str: string): string => {
    return str
      // Convert to lowercase first
      .toLowerCase()
      // Remove leading/trailing spaces
      .trim()
      // Normalize spaces between words
      .replace(/\s+/g, ' ')
      // Remove articles (a, an, the)
      .replace(/^(a|an|the)\s+/g, '')
      .replace(/\s+(a|an|the)\s+/g, ' ')
      // Remove special characters
      .replace(/[^\w\s]/g, '')
      // Final trim for any leftover spaces
      .trim();
  };

  const cleanGuess = cleanString(guess);
  const cleanAnswer = cleanString(answer);

  // Exact match after cleaning
  if (cleanGuess === cleanAnswer) {
    return { isCorrect: true };
  }

  // Check for related titles only if they're actually different
  const guessWords = cleanGuess.split(' ');
  const answerWords = cleanAnswer.split(' ');
  const isCompletelyDifferent = !guessWords.some(word => 
    answerWords.includes(word) && word.length > 3
  );

  // Only use Gemini for potentially related titles
  if (!isCompletelyDifferent) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are helping with a movie guessing game. The user guessed "${guess}".

Rules for providing feedback:
1. If the guess is part of the same series or franchise but not the exact movie we're looking for:
   - Say "This is part of the right series, but not the specific movie we're looking for"
   - DO NOT reveal the actual movie title

2. If the guess is a sequel/prequel but not the one we're looking for:
   - Say "You're close! This is from the same franchise, but we're looking for a different part"
   - DO NOT reveal which part or the actual title

3. If they're completely different movies OR exactly the same movie:
   - Respond with "DIFFERENT"

IMPORTANT: NEVER mention or reveal the correct answer ("${answer}") in your response.

Respond in this format:
If related: "RELATED: [hint without revealing the answer]"
If same or different: "DIFFERENT"`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();

      if (response.startsWith('RELATED:')) {
        const explanation = response.substring(8).trim();
        return {
          isCorrect: false,
          message: `Close! ${explanation}`
        };
      }
    } catch (error) {
      console.error('Error validating guess:', error);
    }
  }

  return { isCorrect: false };
};

export const getHint = async (correctAnswer: string, hintLevel: number): Promise<string> => {
  const prompts = [
    `For the movie/book "${correctAnswer}", give a vague hint about its genre or when it was released. DO NOT mention any character names or specific plot points.`,
    `For the movie/book "${correctAnswer}", give a hint about the setting or theme, without mentioning any character names.`,
    `For the movie/book "${correctAnswer}", give a creative hint about its title, such as whether it includes a location, a concept, or an emotion. Avoid direct spoilers or specific references.`
  ];

  const result = await model.generateContent(prompts[hintLevel - 1]);
  const response = await result.response;
  return response.text().trim();
};
