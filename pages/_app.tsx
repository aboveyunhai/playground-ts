import { AppProps } from "next/app";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "@codesandbox/sandpack-react/dist/index.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
