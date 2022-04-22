import React from "react";
import { ChakraProvider, Button, Heading } from "@chakra-ui/react";
import { CustomTheme } from "./Theme";
import { AddIcon } from "@chakra-ui/icons";

export default function App() {
  return (
    <ChakraProvider theme={CustomTheme}>
      <Heading>Welcome to chakra</Heading>
      <Button color="brand.400" variant="outline" borderColor="brand.100">
        weird style
      </Button>
    </ChakraProvider>
  );
}
