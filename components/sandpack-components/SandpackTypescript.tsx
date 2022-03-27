import {
  SandpackConsumer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackSetup,
  SandpackThemeProvider,
  SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";
import EventEmitter from "@okikio/emitter";
import { useRef, useEffect } from "react";
import { CodeEditor } from "./CodeEditor";

export interface SandpackTypescriptProps {
  customSetup: SandpackSetup;
  template: SandpackPredefinedTemplate;
}

export const SandpackTypescript: React.FC<SandpackTypescriptProps> = ({
  customSetup,
  template,
}) => {
  const tsServer = useRef(
    new Worker(new URL("./workers/tsserver.js", window.location.origin), {
      name: "ts-server",
    })
  );
  const emitter = useRef(new EventEmitter());

  useEffect(function listener() {
    const serverMessageCallback = ({
      data: { event, details },
    }: MessageEvent<{ event: string; details: any }>) => {
      emitter.current.emit(event, details);
    };

    tsServer.current.addEventListener("message", serverMessageCallback);

    return () => {
      tsServer.current.removeEventListener("message", serverMessageCallback);
    };
  }, []);

  return (
    <SandpackProvider template={template} customSetup={customSetup}>
      <SandpackThemeProvider>
        <SandpackLayout theme={"dark"}>
          <SandpackConsumer>
            {(state) => (
              <CodeEditor
                activePath={state?.activePath}
                tsServer={tsServer}
                emitter={emitter}
              />
            )}
          </SandpackConsumer>
          <SandpackPreview />
        </SandpackLayout>
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
