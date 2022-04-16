import {
  SandpackCodeEditor,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { EventEmitter } from "@okikio/emitter";
import { codemirrorTypescriptExtensions } from "./codemirror-extensions";
import React, { useEffect, useImperativeHandle } from "react";
import type { MutableRefObject } from "react";
import { format } from "prettier";
import parserTypeScript from "prettier/parser-typescript";

export interface CustomCodeEditorProps {
  activePath?: string;
  tsServer: MutableRefObject<Worker>;
  emitter: MutableRefObject<EventEmitter>;
}

export type ForwardRefProps = {
  formatCode: () => void;
};

const CodeEditorRef = React.forwardRef<
  ForwardRefProps,
  React.PropsWithChildren<CustomCodeEditorProps>
>(({ activePath, tsServer, emitter }, ref) => {
  const { sandpack } = useSandpack();

  const extensions = codemirrorTypescriptExtensions(
    tsServer.current,
    emitter.current,
    activePath
  );

  const { code, updateCode } = useActiveCode();

  useImperativeHandle(ref, () => ({
    formatCode() {
      const formattedCode = format(code, {
        semi: false,
        parser: "typescript",
        plugins: [parserTypeScript],
      });
      updateCode(formattedCode);
    },
  }));

  useEffect(function init() {
    emitter.current.on("ready", () => {
      const getTypescriptCache = () => {
        const cache = new Map();
        const keys = Object.keys(localStorage);

        keys.forEach((key) => {
          if (key.startsWith("ts-lib-")) {
            cache.set(key, localStorage.getItem(key));
          }
        });

        return cache;
      };

      tsServer.current.postMessage({
        event: "create-system",
        details: {
          files: sandpack.files,
          entry: sandpack.activePath,
          fsMapCached: getTypescriptCache(),
        },
      });
    });

    emitter.current.on(
      "cache-typescript-fsmap",
      ({ version, fsMap }: { version: string; fsMap: Map<string, string> }) => {
        fsMap.forEach((file, lib) => {
          const cacheKey = "ts-lib-" + version + "-" + lib;
          localStorage.setItem(cacheKey, file);
        });
      }
    );
  }, []);

  return <SandpackCodeEditor showTabs extensions={extensions} />;
});

export const CodeEditor = React.memo(CodeEditorRef);
