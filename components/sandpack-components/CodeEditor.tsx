import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";

import { EventEmitter } from "@okikio/emitter";
import { codemirrorTypescriptExtensions } from "./codemirror-extensions";
import React, { memo, useEffect } from "react";
import type { MutableRefObject } from "react";

export const CodeEditor: React.FC<{
  activePath?: string;
  tsServer: MutableRefObject<Worker>;
  emitter: MutableRefObject<EventEmitter>;
}> = memo(({ activePath, tsServer, emitter }) => {
  const { sandpack } = useSandpack();

  const extensions = codemirrorTypescriptExtensions(
    tsServer.current,
    emitter.current,
    activePath
  );

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
