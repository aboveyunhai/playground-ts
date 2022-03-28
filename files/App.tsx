import React, { useState } from "react";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import { CustomTheme } from "./Theme";
import { Button } from "@chakra-ui/button";
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
      <Button color="brand.400" variant="outline" borderColor="brand.100">
        "weird style"
      </Button>
    </ChakraProvider>
  );
}
