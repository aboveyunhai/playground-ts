import React, { useState } from "react";
import { ChakraProvider, Heading, Button, IconButton } from "@chakra-ui/react";
import { CustomTheme } from "./Theme";
import { AddIcon } from "@chakra-ui/icons";

export default function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((prev) => prev + 1);
  };
  return (
    <ChakraProvider theme={CustomTheme}>
      <Heading>Welcome to chakra</Heading>
      <Button colorScheme="teal" onClick={handleClick}>
        {count}
      </Button>
      <IconButton
        aria-label={"icon-button"}
        color="brand.400"
        variant="outline"
        borderColor="brand.100"
        icon={<AddIcon />}
      />
    </ChakraProvider>
  );
}
