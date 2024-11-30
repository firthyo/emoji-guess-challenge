import { useState, useCallback, useEffect } from 'react';
import {
  Box,

  Text,
  VStack,

  useToast,
} from '@chakra-ui/react';
import { generateEmojiSequence, validateGuess, getHint } from '../services/gemini';
import { GameHeader } from './GameHeader';
import { EmojiDisplay } from './EmojiDisplay';
import { GuessInput } from './GuessInput';
import { GameControls } from './GameControls';
import { GuessHistory } from './GuessHistory';
import { AttemptsIndicator } from './AttemptsIndicator';

const MAX_ATTEMPTS = 5;

interface GameState {
  currentEmojis: string;
  difficulty: string;
  score: number;
  hintsUsed: number;
  currentAnswer: string;
  recentAnswers: string[];
  attemptsLeft: number;
  hints: string[];
  message: string;
  guessHistory: string[];
}

const initialState: GameState = {
  currentEmojis: '',
  difficulty: 'easy',
  score: 0,
  hintsUsed: 0,
  currentAnswer: '',
  recentAnswers: [],
  attemptsLeft: MAX_ATTEMPTS,
  hints: [],
  message: '',
  guessHistory: [],
};

export function Game() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [guess, setGuess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = useCallback(async () => {
    setIsLoading(true);
    try {
      const { emojis, answer } = await generateEmojiSequence(gameState.difficulty, gameState.recentAnswers);
      console.log('Starting new round:', { emojis, answer });

      setGameState(prev => {
        const newRecentAnswers = [answer, ...prev.recentAnswers].slice(0, 10);
        return {
          ...prev,
          currentEmojis: emojis,
          currentAnswer: answer,
          hintsUsed: 0,
          hints: [],
          attemptsLeft: MAX_ATTEMPTS,
          recentAnswers: newRecentAnswers,
          message: '',
          guessHistory: [], // Reset guess history
        };
      });
      setGuess('');
    } catch (error) {
      console.error('Error in startNewRound:', error);
      toast({
        title: 'Error starting new round',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
    setIsLoading(false);
  }, [gameState.difficulty, gameState.recentAnswers, toast]);

  const handleGuess = async () => {
    if (!guess.trim()) return;

    setIsLoading(true);
    try {
      console.log('Checking guess:', { guess, answer: gameState.currentAnswer });
      const result = await validateGuess(guess, gameState.currentAnswer);
      console.log('Guess result:', result);

      // Add guess to history
      setGameState(prev => ({
        ...prev,
        guessHistory: [...prev.guessHistory, guess]
      }));

      if (result.isCorrect) {
        let pointsEarned = 3; // Base points for no hints
        if (gameState.hintsUsed === 1) {
          pointsEarned = 2; // 2 points with 1 hint
        } else if (gameState.hintsUsed >= 2) {
          pointsEarned = 1; // 1 point with 2-3 hints
        }

        setGameState(prev => ({
          ...prev,
          score: prev.score + pointsEarned,
          message: "Correct! 🎉"
        }));
        toast({
          title: 'Correct!',
          description: `You earned ${pointsEarned} points!`,
          status: 'success',
          duration: 3000,
        });
        await startNewRound();
      } else {
        const newAttemptsLeft = gameState.attemptsLeft - 1;
        setGameState(prev => ({
          ...prev,
          attemptsLeft: newAttemptsLeft,
          message: result.message || "Try again!"
        }));

        if (newAttemptsLeft <= 1) {
          toast({
            title: 'Game Over!',
            description: 'Starting new round...',
            status: 'error',
            duration: 3000,
          });
          await startNewRound();
        }
      }
    } catch (error) {
      console.error('Error in handleGuess:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setGuess(''); // Clear input after every guess attempt
    }
  };

  const requestHint = async () => {
    if (gameState.hintsUsed >= 3) {
      toast({
        title: 'No more hints available',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const newHint = await getHint(gameState.currentAnswer, gameState.hintsUsed + 1);
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        hints: [...prev.hints, newHint],
      }));
    } catch (error) {
      console.error('Error in requestHint:', error);
      toast({
        title: 'Error getting hint',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="brand.background.dark"
      overflow="hidden"
      position="fixed"
      top="0"
      left="0"
    >
      <VStack
        spacing={{ base: 4, md: 8 }}
        align="center"
        p={{ base: 4, md: 8 }}

        maxW={{ base: "95%", sm: "600px", lg: "800px" }}
        w="90%"
        maxH={{ base: "95vh", md: "90vh" }}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            background: 'brand.background.dark',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'brand.accent',
            borderRadius: '24px',
          },
        }}
      >
        <GameHeader score={gameState.score} />

        <EmojiDisplay emojis={gameState.currentEmojis} />

        <AttemptsIndicator
          maxAttempts={MAX_ATTEMPTS}
          attemptsLeft={gameState.attemptsLeft}
        />

        <GuessInput
          guess={guess}
          isLoading={isLoading}
          onGuessChange={setGuess}
          onGuessSubmit={handleGuess}
        />

        <GameControls
          onRequestHint={requestHint}
          onNewGame={startNewRound}
          isLoading={isLoading}
          hintsUsed={gameState.hintsUsed}
        />

        <GuessHistory previousGuesses={gameState.guessHistory} />

        {gameState.hints.length > 0 && (
          <VStack
            w="full"
            spacing={3}
            border="2px solid"
            borderColor="brand.secondary"
            p={{ base: 3, md: 4 }}
            bg="brand.background.dark"
          >
            <Text variant="hint" fontSize={{ base: "md", md: "lg" }}>
              [HINTS]
            </Text>
            {gameState.hints.map((hint, index) => (
              <Text
                key={index}
                variant="retro"
                color="brand.secondary"
                textAlign="center"
                w="full"
                p={2}
                borderBottom="1px dashed"
                borderColor="brand.secondary"
                fontSize={{ base: "sm", md: "md" }}
                opacity={0.8}
              >
                {index + 1}. {hint}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
