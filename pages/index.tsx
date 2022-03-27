import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import type { SandpackTypescriptProps } from "../components/sandpack-components/SandpackTypescript";

const EditorLazyLoad = dynamic<SandpackTypescriptProps>(
  () =>
    import("../components/sandpack-components/SandpackTypescript").then(
      (mod) => mod.SandpackTypescript
    ),
  { ssr: false }
);

const IndexPage = () => {
  return (
    <Box>
      <EditorLazyLoad
        template="react-ts"
        customSetup={{
          dependencies: {
            "@chakra-ui/react": "latest",
            "@emotion/react": "latest",
            "@emotion/styled": "latest",
            "framer-motion": "latest",
          },
          files: {
            "/App.tsx": {
              code: `import React from "react"
import { Flex } from '@chakra-ui/react'

export default function App(): JSX.Element {
  return (
    <Flex 
      w="100vw" 
      h="100vh" 
      justifyContent="center"
    >
      <h2>Hello world!</h2>
    </Flex>
  )
}`,
            },
          },
        }}
      />
    </Box>
  );
};

export default IndexPage;
