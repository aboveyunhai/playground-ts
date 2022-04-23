import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, Flex, Select } from "@chakra-ui/react";
import type { SandpackPredefinedTheme, SandpackThemeProp } from "@codesandbox/sandpack-react";
import type { SandpackTypescriptProps } from "../components/sandpack-components/SandpackTypescript";

import { ColorModeBtn } from "../components/ColorModeBtn";

import AppCode from '!!raw-loader!../files/App.tsx';
import ButtonCode from '!!raw-loader!../files/Button.tsx';
import ThemeCode from '!!raw-loader!../files/Theme.tsx';
import { ForwardRefProps } from "../components/sandpack-components/CodeEditor";

const PredefinedTheme: SandpackPredefinedTheme[] = [
  "dark",
  "light",
  "sandpack-dark",
  "night-owl",
  "aqua-blue",
  "github-light",
  "monokai-pro",
];

const EditorLazyLoad = dynamic<SandpackTypescriptProps>(
  () =>
    import("../components/sandpack-components/SandpackTypescript").then(
      (mod) => mod.SandpackTypescript
    ),
  { ssr: false }
);

const IndexPage = () => {
  const codeEditorRef = useRef<ForwardRefProps>(null);
  const [theme, setTheme] = useState<SandpackPredefinedTheme>(PredefinedTheme[0]);

  const changeTheme = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.currentTarget.value as SandpackPredefinedTheme;
    if (newTheme) {
      setTheme(newTheme);
    }
  }, []);

  const formatCode = useCallback(() => {
    if (!codeEditorRef.current) return;
    codeEditorRef.current.formatCode();
  }, []);

  return (
    <Flex flexDirection={"column"}>
      <Flex>
        <Button onClick={formatCode} colorScheme={"messenger"}>
          format code
        </Button>
        <ColorModeBtn />
        <Select value={theme} onChange={changeTheme} width="150px">
          {PredefinedTheme.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex gap={"1rem"}>
        <Button
          onClick={() => codeEditorRef.current.updateFile("/App.tsx", AppCode)}
        >
          App
        </Button>
        <Button
          onClick={() =>
            codeEditorRef.current.updateFile("/App.tsx", ButtonCode)
          }
        >
          Button
        </Button>
      </Flex>
      <Box flex="auto">
        <EditorLazyLoad
          template="react-ts"
          customSetup={{
            dependencies: {
              "@chakra-ui/react": "latest",
              "@chakra-ui/icons": "latest",
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
          codeEditorRef={codeEditorRef}
        />
      </Box>
    </Flex>
  );
};

export default IndexPage;
