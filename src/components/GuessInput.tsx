import { Button, Input, VStack } from '@chakra-ui/react';

interface GuessInputProps {
  guess: string;
  isLoading: boolean;
  onGuessChange: (value: string) => void;
  onGuessSubmit: () => void;
}

export function GuessInput({ guess, isLoading, onGuessChange, onGuessSubmit }: GuessInputProps) {
  return (
    <VStack w="full" spacing={{ base: 2, md: 4 }}>
      <Input
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
        placeholder="Enter your guess..."
        size="md"
        maxW="300px"
        variant="filled"
        bg="whiteAlpha.100"
        color="white"
        _hover={{ bg: "whiteAlpha.200" }}
        _focus={{ bg: "whiteAlpha.200" }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onGuessSubmit();
          }
        }}
      />
      <Button
        onClick={onGuessSubmit}
        isLoading={isLoading}
        size="md"
        maxW="300px"
        variant="primary"
        isDisabled={!guess.trim()}
      >
        Guess
      </Button>
    </VStack>
  );
}
