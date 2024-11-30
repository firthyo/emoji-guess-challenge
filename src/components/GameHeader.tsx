import { Heading, Text, VStack } from '@chakra-ui/react';

interface GameHeaderProps {
  score: number;
}

export function GameHeader({ score }: GameHeaderProps) {
  return (
    <VStack spacing={4} mb={8}>
      <Heading variant="retro" fontSize={{ base: "3xl", md: "4xl" }}>
        EMOJI GUESS
      </Heading>
      <Text variant="score" fontSize={{ base: "xl", md: "2xl" }}>
        SCORE: {score}
      </Text>
    </VStack>
  );
}
