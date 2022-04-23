import {
  SandpackCodeEditor,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { EventEmitter } from "@okikio/emitter";
import { codemirrorTypescriptExtensions } from "./codemirror-extensions";
import React, { useCallback, useEffect, useImperativeHandle, useMemo } from "react";
import type { MutableRefObject } from "react";
import { format } from "prettier";
import parserTypeScript from "prettier/parser-typescript";

export interface CustomCodeEditorProps {
  tsServer: MutableRefObject<Worker>;
  emitter: MutableRefObject<EventEmitter>;
  activePath: string;
}

export type ForwardRefProps = {
  formatCode: () => void;
  updateFile: (path: string, code: string) => void;
};

const CodeEditorRef = React.forwardRef<
  ForwardRefProps,
  React.PropsWithChildren<CustomCodeEditorProps>
>(({ tsServer, emitter, activePath }, ref) => {
  const { sandpack } = useSandpack();
  const { code: activeCode, updateCode } = useActiveCode();
  const extensions = useMemo(() => codemirrorTypescriptExtensions(
    tsServer.current,
    emitter.current,
    activePath
  ), [emitter, activePath, tsServer]);

  useImperativeHandle(
    ref,
    () => ({
      formatCode() {
        const formattedCode = format(activeCode, {
          semi: false,
          parser: "typescript",
          plugins: [parserTypeScript],
        });
        sandpack.updateFile(activePath, formattedCode);
      },
      updateFile(path: string, code: string) {
        if (path && code) {
          sandpack.updateFile(path, code);
        }
      },
    }),
    [activeCode, activePath, sandpack]
  );

  const getTypescriptCache = useCallback(() => {
    const cache = new Map();
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("ts-lib-")) {
        cache.set(key, localStorage.getItem(key));
      }
    });

    return cache;
  }, []);

  useEffect(() => {
    const current = emitter.current;
    current.on("ready", () => {
      tsServer.current.postMessage({
        event: "create-system",
        details: {
          files: sandpack.files,
          entry: sandpack.activePath,
          fsMapCached: getTypescriptCache(),
        },
      });
    });

    current.on(
      "cache-typescript-fsmap",
      ({ version, fsMap }: { version: string; fsMap: Map<string, string> }) => {
        fsMap.forEach((file, lib) => {
          const cacheKey = "ts-lib-" + version + "-" + lib;
          localStorage.setItem(cacheKey, file);
        });
      }
    );

    return () => {
      current.off("ready");
      current.off("cache-typescript-fsmap");
    };
  }, [emitter, getTypescriptCache, sandpack.activePath, sandpack.files, tsServer]);

  return (
    <SandpackCodeEditor
      showTabs
      extensions={extensions}
      showLineNumbers={true}
      showInlineErrors={true}
    />
  );
});

CodeEditorRef.displayName = "CodeEditorRef";
export const CodeEditor = React.memo(CodeEditorRef);
