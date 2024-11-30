import { Text, VStack } from '@chakra-ui/react';

interface GuessHistoryProps {
  previousGuesses: string[];
}

export function GuessHistory({ previousGuesses }: GuessHistoryProps) {
  if (previousGuesses.length === 0) return null;

  return (
    <VStack spacing={2} w="full" maxW="300px" mt={4}>
      <Text color="whiteAlpha.700" fontSize="sm">Previous Guesses:</Text>
      {previousGuesses.map((guess, index) => (
        <Text 
          key={index} 
          color="whiteAlpha.900"
          fontSize="md"
          textAlign="center"
        >
          {guess}
        </Text>
      ))}
    </VStack>
  );
}
