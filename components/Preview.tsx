import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";


import { ChakraProvider } from "@chakra-ui/react";
import { CustomTheme } from "../files/Theme";
import React from "react";
import App from "../files/App";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";

const GlobalScope = { ...require("@chakra-ui/react") };

export const Preview = () => {
  const code = useSandpack();
  const appCode = code.sandpack.files['/App.tsx'].code;

  console.log(appCode)
  const scope = { ...GlobalScope, app: appCode }

  return (
    <Box>
      <Heading>React live</Heading>
      <Box borderWidth={1}>
        <LiveProvider code={"<App />"} scope={scope}>
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      </Box>
      <Box />
    </Box>
  );
};

