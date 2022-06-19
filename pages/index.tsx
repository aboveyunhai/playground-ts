import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Flex, Select, useToast } from "@chakra-ui/react";
import { Sandpack, SandpackPredefinedTheme } from "@codesandbox/sandpack-react";
import {
  SandpackTypescript,
  SandpackTypescriptProps,
} from "../components/sandpack-components/SandpackTypescript";

import { ColorModeBtn } from "../components/ColorModeBtn";

import AppCode from "!!raw-loader!../files/App.tsx";
import ButtonCode from "!!raw-loader!../files/Button.tsx";
import ThemeCode from "!!raw-loader!../files/Theme.tsx";
import { ForwardRefProps } from "../components/sandpack-components/CodeEditor";

const PredefinedTheme: SandpackPredefinedTheme[] = ["dark", "light", "auto"];

const IndexPage = () => {
  const codeEditorRef = useRef<ForwardRefProps>(null);
  const [theme, setTheme] = useState<SandpackPredefinedTheme>(
    PredefinedTheme[0]
  );
  const toast = useToast();

  const changeTheme = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newTheme = event.currentTarget.value as SandpackPredefinedTheme;
      if (newTheme) {
        setTheme(newTheme);
      }
    },
    []
  );

  const formatCode = useCallback(() => {
    if (!codeEditorRef.current) return;
    try {
      codeEditorRef.current.formatCode();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Flex flexDirection={"column"}>
      <Flex>
        <Button
          onClick={formatCode}
          colorScheme={"messenger"}
          size="sm"
          rounded={"none"}
        >
          format code
        </Button>
        <ColorModeBtn size="sm" rounded={"none"} />
        <Select
          value={theme}
          onChange={changeTheme}
          width="150px"
          size="sm"
          rounded={"none"}
        >
          {PredefinedTheme.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </Select>
        <Button
          size="sm"
          rounded={"none"}
          onClick={() => {
            try {
              codeEditorRef.current.updateFile("/App.tsx", AppCode);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          App
        </Button>
        <Button
          size="sm"
          rounded={"none"}
          onClick={() =>
            codeEditorRef.current.updateFile("/App.tsx", ButtonCode)
          }
        >
          Button
        </Button>
      </Flex>
      <Box flex="auto">
        <SandpackTypescript
          template="react-ts"
          files={{
            "/App.tsx": { code: AppCode },
            "/Theme.tsx": { code: ThemeCode },
          }}
          customSetup={{
            dependencies: {
              "@chakra-ui/react": "latest",
              "@chakra-ui/icons": "latest",
              "@emotion/react": "latest",
              "@emotion/styled": "latest",
              "framer-motion": "latest",
            },
          }}
          theme={theme}
          codeEditorRef={codeEditorRef}
        />
      </Box>
    </Flex>
  );
};

export default IndexPage;
