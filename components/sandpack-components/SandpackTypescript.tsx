import { Box, Button } from "@chakra-ui/react";
import {
  SandpackConsumer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackSetup,
  SandpackThemeProvider,
  SandpackPredefinedTemplate,
  SandpackThemeProp,
} from "@codesandbox/sandpack-react";
import EventEmitter from "@okikio/emitter";
import { useRef, useEffect } from "react";
import { Preview } from "../Preview";
import { CodeEditor, ForwardRefProps } from "./CodeEditor";

export interface SandpackTypescriptProps {
  customSetup: SandpackSetup;
  template: SandpackPredefinedTemplate;
  theme?: SandpackThemeProp;
  codeEditorRef?: React.MutableRefObject<ForwardRefProps>;
}

export const SandpackTypescript: React.FC<SandpackTypescriptProps> = ({
  customSetup,
  template,
  theme,
  codeEditorRef,
}) => {
  const tsServer = useRef<Worker>(null);
  const emitter = useRef<EventEmitter>(null);

  useEffect(function listener() {
    if (!tsServer.current) {
      tsServer.current = new Worker(
        new URL("./workers/tsserver.js", window.location.origin),
        {
          name: "ts-server",
        }
      );
    }

    if (!emitter.current) {
      emitter.current = new EventEmitter();
    }

    const serverMessageCallback = ({
      data: { event, details },
    }: MessageEvent<{ event: string; details: any }>) => {
      emitter.current.emit(event, details);
    };

    tsServer.current.addEventListener("message", serverMessageCallback);

    return () => {
      tsServer.current.removeEventListener("message", serverMessageCallback);
      tsServer.current.terminate();
    };
  }, []);

  return (
    <SandpackProvider template={template} customSetup={customSetup}>
      <SandpackThemeProvider>
        <SandpackLayout theme={theme}>
          <SandpackConsumer>
            {(state) =>
              tsServer.current &&
              emitter.current && (
                <CodeEditor
                  activePath={state?.activePath}
                  tsServer={tsServer}
                  emitter={emitter}
                  ref={codeEditorRef}
                />
              )
            }
          </SandpackConsumer>
          {/* <Box padding={"10px"} width="500px"> */}
            <SandpackPreview />
          {/* </Box> */}
        </SandpackLayout>
        {/* <Preview /> */}
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
