import { baseStyle, extendTheme } from "@chakra-ui/react";

export default extendTheme({
  fonts: {
    body: "Calibre, Inter, sans-serif",
    heading: "Calibre, Inter, sans-serif",
  },

  styles: {
    global: {
      body: {
        color: "rgb(0 0 0 / 72%)",
        fontWeight: 500,
      },
    },
  },

  components: {
    Text: {
      baseStyle: {
        color: "rgb(0 0 0 / 72%)",
      },
    },

    Link: {
      baseStyle: {
        borderBottom: "1px solid",
        _hover: {
          textDecoration: "none",
          color: "black",
        },
      },
    },

    Button: {
      sizes: {
        lg: {
          h: 16,
        },
      },

      variants: {
        outline: {
          borderColor: "1px solid black",
          backgroundColor: "transparent",
          rounded: "0px",
        },

        primary: {
          backgroundColor: "black",
          rounded: "8px",
          color: "#fff",
          _hover: {
            backgroundColor: "rgb(0 0 0 / 90%)",
            transform: "scale(1.05)",
            _disabled: {
              backgroundColor: "rgb(0 0 0 / 90%)",
            },
          },
        },

        solid: {
          backgroundColor: "black",
          rounded: "0px",
          color: "#fff",
          px: 12,
          _hover: {
            backgroundColor: "rgb(0 0 0 / 95%)",
            transform: "scale(1.05)",
            _disabled: {
              backgroundColor: "rgb(0 0 0 / 95%)",
            },
          },
        },
      },
    },
  },
});
