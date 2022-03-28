import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Flex } from "@chakra-ui/react";
import type { SandpackThemeProp } from "@codesandbox/sandpack-react";
import type { SandpackTypescriptProps } from "../components/sandpack-components/SandpackTypescript";

import { ColorModeBtn } from "../components/ColorModeBtn";

import AppCode from '!!raw-loader!../files/App.tsx';
import ThemeCode from '!!raw-loader!../files/Theme.tsx';

const EditorLazyLoad = dynamic<SandpackTypescriptProps>(
  () =>
    import("../components/sandpack-components/SandpackTypescript").then(
      (mod) => mod.SandpackTypescript
    ),
  { ssr: false }
);

const IndexPage = () => {
  const [theme, setTheme] = useState<SandpackThemeProp>("dark");

  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  return (
    <Flex flexDirection={"column"}>
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
              "/App.tsx": { code: AppCode },
              "/Theme.tsx": { code: ThemeCode },
            },
          }}
          theme={theme}
        />
      </Box>
      <Box>
        <Button onClick={changeTheme}>set sandpack theme</Button>
        <ColorModeBtn />
      </Box>
    </Flex>
  );
};

export default IndexPage;
