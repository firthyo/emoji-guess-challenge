import { Box, HStack } from '@chakra-ui/react';

interface AttemptsIndicatorProps {
  maxAttempts: number;
  attemptsLeft: number;
}

export function AttemptsIndicator({ maxAttempts, attemptsLeft }: AttemptsIndicatorProps) {
  return (
    <HStack spacing={{ base: 2, md: 4 }} justify="center" my={4}>
      {[...Array(maxAttempts)].map((_, i) => (
        <Box
          key={i}
          w={{ base: "4", md: "6" }}
          h={{ base: "4", md: "6" }}
          bg={i < attemptsLeft ? "#00FF00" : "gray.600"}
          boxShadow={i < attemptsLeft ? "0 0 10px #00FF00" : "none"}
          transform={i < attemptsLeft ? "scale(1.2)" : "scale(1)"}
          transition="all 0.3s"
          borderRadius="sm"
        />
      ))}
    </HStack>
  );
}
