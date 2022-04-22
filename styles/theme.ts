import { extendTheme, ThemingProps, ColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

type Dict<T = any> = Record<string, T>;
type StyleConfigProps = Dict &
  Omit<ThemingProps, "styleConfig"> & {
    colorMode: ColorMode;
  };

const theme = extendTheme({
  styles: {
    global: (props: StyleConfigProps) => ({
      // "::-webkit-scrollbar": {
      //   width: "8px",
      // },
      // "::-webkit-scrollbar:horizontal": {
      //   height: "8px",
      // },
      // "::-webkit-scrollbar-track": {
      //   background: mode("black", "gray.800")(props),
      //   borderRadius: "10px",
      // },
      // "::-webkit-scrollbar-thumb": {
      //   background: mode("#eee", "#424242")(props),
      //   borderRadius: "10px",
      // },
      // "::-webkit-scrollbar-thumb:hover": {
      //   background: mode("#bbb", "#757575")(props),
      // },
    }),
  },
});

export default theme;
