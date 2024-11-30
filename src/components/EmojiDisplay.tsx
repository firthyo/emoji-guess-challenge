import { Box, Text } from '@chakra-ui/react';

interface EmojiDisplayProps {
  emojis: string;
}

export function EmojiDisplay({ emojis }: EmojiDisplayProps) {
  return (
    <Box 
      py={{ base: 4, md: 8 }}
      px={{ base: 3, md: 6 }}
      w="full"
      maxW="600px"
      bg="whiteAlpha.100"
      borderRadius="lg"
      boxShadow="0 0 10px rgba(0, 255, 255, 0.2)"
      textAlign="center"
      _hover={{
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)"
      }}
      transition="all 0.3s ease"
    >
      <Text 
        fontSize={{ base: "3xl", md: "5xl" }} 
        letterSpacing="8px"
        fontFamily="emoji"
      >
        {emojis || '🎮'}
      </Text>
    </Box>
  );
}
