import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    primary: '#FF00FF',    // neon pink
    secondary: '#00FFFF',  // neon cyan
    accent: '#FFFF00',     // neon yellow
    purple: '#8A2BE2',     // bright purple
    success: '#00FF00',    // neon green for indicators
    background: {
      dark: '#0A0A1F',     // deep navy
      light: '#1A1A3A'     // lighter navy
    }
  }
};

const fonts = {
  heading: 'monospace',
  body: 'monospace'
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: 'monospace',
      transition: 'all 0.3s ease',
    },
    variants: {
      primary: {
        bg: 'brand.primary',
        color: 'black',
        _hover: {
          bg: 'brand.primary',
          boxShadow: '0 0 10px #FF00FF',
          transform: 'scale(1.05)'
        }
      },
      outline: {
        borderWidth: '2px',
        _hover: {
          boxShadow: '0 0 10px',
          transform: 'scale(1.05)'
        }
      }
    }
  },
  Input: {
    variants: {
      retro: {
        field: {
          bg: 'brand.background.dark',
          borderWidth: '2px',
          borderColor: 'brand.primary',
          color: 'brand.primary',
          textAlign: 'center',
          fontFamily: 'monospace',
          _hover: {
            borderColor: 'brand.primary',
            boxShadow: '0 0 10px #FF00FF'
          },
          _focus: {
            borderColor: 'brand.primary',
            boxShadow: '0 0 15px #FF00FF'
          }
        }
      }
    }
  },
  Container: {
    baseStyle: {
      maxW: '100%',
      p: 0,
      m: 0
    }
  },
  Text: {
    variants: {
      retro: {
        fontFamily: 'monospace',
        letterSpacing: '1px'
      },
      score: {
        color: 'brand.primary',
        fontFamily: 'monospace',
        textShadow: '0 0 5px #FF00FF'
      },
      hint: {
        color: 'brand.secondary',
        fontFamily: 'monospace',
        textShadow: '0 0 5px #00FFFF'
      }
    }
  },
  Heading: {
    variants: {
      retro: {
        color: 'brand.secondary',
        fontFamily: 'monospace',
        letterSpacing: '4px',
        textShadow: '0 0 10px #00FFFF'
      }
    }
  },
  Box: {
    variants: {
      gameContainer: {
        bg: 'brand.background.light',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: 'brand.accent',
        boxShadow: '0 0 20px',
        borderRadius: 'lg'
      },
      emojiDisplay: {
        bg: 'brand.background.dark',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: 'brand.purple',
        boxShadow: 'inset 0 0 10px'
      }
    }
  }
};

const styles = {
  global: {
    body: {
      bg: 'brand.background.dark',
      color: 'white'
    }
  }
};

export const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
});
