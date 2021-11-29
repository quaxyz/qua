import { baseStyle, extendTheme } from "@chakra-ui/react";

export default extendTheme({
  fonts: {
    body: "Calibre, Inter, sans-serif",
    heading: "Calibre, Inter, sans-serif",
  },

  styles: {
    global: {},
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
      },
    },
  },
});
