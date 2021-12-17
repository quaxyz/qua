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

    Modal: {
      baseStyle: {
        dialog: {
          mx: 5,
        },
        header: {
          borderBottom: "1px solid rgb(0 0 0 / 24%)",
        },
      },
    },

    Input: {
      sizes: {
        lg: {
          field: {
            fontWeight: 700,
            fontSize: "2xl",
            py: 6,
          },
        },
      },

      variants: {
        outline: {
          field: {
            rounded: "0px",
            border: "1px solid",
            borderColor: "rgb(0 0 0 / 26%)",
            color: "black",

            _hover: {
              borderColor: "rgb(0 0 0 / 60%)",
            },

            _placeholder: {
              color: "rgb(0 0 0 / 36%)",
            },

            _focus: {
              borderColor: "rgb(0 0 0 / 60%)",
              outline: "none",
              boxShadow: "none",
            },
          },
        },

        flushed: {
          field: {
            borderBottom: "1px solid rgb(0 0 0 / 24%)",

            _hover: {
              borderColor: "rgb(0 0 0 / 60%)",
            },

            _placeholder: {
              color: "rgb(0 0 0 / 12%)",
            },

            _focus: {
              borderColor: "rgb(0 0 0 / 60%)",
              outline: "none",
              boxShadow: "none",
            },
          },
        },
      },
    },

    SelectMenu: {
      baseStyle: {
        w: "100%",
        cursor: "pointer",
      },

      sizes: {
        md: {
          fontWeight: 600,
          fontSize: "md",
        },

        lg: {
          fontWeight: 700,
          fontSize: "2xl",
        },
      },

      variants: {
        outline: {
          rounded: "0px",
          border: "1px solid",
          borderColor: "rgb(0 0 0 / 12%)",
          color: "black",
          py: 2,
          px: 4,

          _hover: {
            borderColor: "rgb(0 0 0 / 60%)",
          },
        },

        flushed: {
          borderBottom: "1px solid rgb(0 0 0 / 24%)",
          pt: 3,
          pb: 2,

          _hover: {
            borderColor: "rgb(0 0 0 / 60%)",
          },
        },
      },
    },

    FormLabel: {
      variants: {
        outlined: {
          textTransform: "uppercase",
          fontSize: "xs",
          fontWeight: "600",
          color: "rgb(0 0 0 / 72%)",
        },

        flushed: {},
      },

      defaultProps: {
        variant: "outlined",
      },
    },

    Tabs: {
      variants: {
        line: {
          tablist: {
            borderBottom: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.24)",
          },

          tab: {
            color: "rgb(0 0 0 / 48%)",
            borderBottom: "1px solid",
            borderColor: "transparent",

            _selected: {
              color: "rgb(0 0 0 / 72%)",
              fontWeight: "600",
            },
            _active: {
              bg: "transparent",
            },
            _focus: {
              boxShadow: "none",
            },
          },
        },
      },
    },

    Textarea: {
      variants: {
        outline: {
          rounded: "0px",
          border: "1px solid",
          borderColor: "rgb(0 0 0 / 26%)",
          color: "black",

          _hover: {
            borderColor: "rgb(0 0 0 / 60%)",
          },

          _placeholder: {
            color: "rgb(0 0 0 / 36%)",
          },

          _focus: {
            borderColor: "rgb(0 0 0 / 60%)",
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
  },
});
