import { extendTheme } from "@chakra-ui/react";

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
      button: {
        _focus: {
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.2) !important",
        },
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
          transform: "scale(1.02)",
        },
        _focus: { boxShadow: "none" },
      },
    },

    Button: {
      sizes: {
        lg: {
          h: 16,
        },
      },

      variants: {
        primary: {
          backgroundColor: "black",
          rounded: "8px",
          color: "#fff",
          _hover: {
            backgroundColor: "rgb(0 0 0 / 90%)",
            transform: "scale(1.02)",
            _disabled: {
              backgroundColor: "rgb(0 0 0 / 90%)",
            },
          },
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },

        "primary-outline": {
          border: "1px solid rgb(0 0 0 / 26%)",
          backgroundColor: "transparent",
          rounded: "8px",
        },

        solid: {
          backgroundColor: "black",
          rounded: "0px",
          color: "#fff",
          px: 12,
          _hover: {
            backgroundColor: "rgb(0 0 0 / 95%)",
            transform: "scale(1.02)",
            _disabled: {
              backgroundColor: "rgb(0 0 0 / 95%)",
            },
          },
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },

        "solid-outline": {
          border: "1px solid rgba(19, 20, 21, 80%)",
          backgroundColor: "transparent",
          rounded: "0px",
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },

        "solid-disabled": {
          background: "black",
          color: "#fff",
          opacity: "0.24",
          rounded: "0px",
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
            borderBottom: "1px solid rgba(19, 20, 21, 24%)",

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
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
        },

        flushed: {
          borderBottom: "1px solid rgb(0 0 0 / 24%)",
          pt: 3,
          pb: 2,

          _hover: {
            borderColor: "rgb(0 0 0 / 60%)",
          },
          _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
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

    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: "#212121",
            borderColor: "#212121",

            _hover: {
              bg: "#212121",
              borderColor: "#212121",
            },
            _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
          },
        },
        label: {
          fontWeight: "500",
          ml: 4,
        },
      },

      md: {
        label: { fontSize: "sm" },
      },

      lg: {
        label: { fontSize: "md" },
      },
    },

    Radio: {
      baseStyle: {
        control: {
          _checked: {
            bg: "#000000",
            borderColor: "#000000",

            _hover: {
              bg: "#000000",
              borderColor: "#000000",
            },
            _focus: { boxShadow: "0 0 0 1.8px rgba(0, 0, 0, 0.4)" },
          },
        },
        label: {
          fontWeight: "500",
          ml: 4,
        },
      },

      md: {
        label: { fontSize: "sm" },
      },

      lg: {
        label: { fontSize: "md" },
      },
    },
  },
});
