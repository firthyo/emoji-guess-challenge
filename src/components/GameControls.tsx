import { Button, HStack } from '@chakra-ui/react';

interface GameControlsProps {
  onRequestHint: () => void;
  onNewGame: () => void;
  isLoading: boolean;
  hintsUsed: number;
}

export function GameControls({ onRequestHint, onNewGame, isLoading, hintsUsed }: GameControlsProps) {
  return (
    <HStack 
      w="full" 
      spacing={{ base: 2, md: 4 }}
      justify="center"
    >
      <Button
        variant="outline"
        borderColor="brand.secondary"
        color="brand.secondary"
        onClick={onRequestHint}
        isDisabled={isLoading || hintsUsed >= 3}
        size="lg"
        w={{ base: "full", md: "150px" }}
        _hover={{
          boxShadow: "0 0 10px #FFD700"
        }}
      >
        HINT ({3 - hintsUsed})
      </Button>
      <Button
        variant="outline"
        borderColor="brand.accent"
        color="brand.accent"
        onClick={onNewGame}
        isDisabled={isLoading}
        size="lg"
        w={{ base: "full", md: "150px" }}
        _hover={{
          boxShadow: "0 0 10px #00FFFF"
        }}
      >
        NEW GAME
      </Button>
    </HStack>
  );
}
