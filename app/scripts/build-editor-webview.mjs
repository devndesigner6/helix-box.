import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const entryPath = path.join(rootDir, "plugins/core/editor/codemirror-web-entry.ts");
const outPath = path.join(rootDir, "plugins/core/editor/codemirrorWebBundle.ts");

const result = await build({
  entryPoints: [entryPath],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  write: false,
  minify: true,
});

const output = result.outputFiles[0]?.text;
if (!output) {
  throw new Error("Failed to generate CodeMirror webview bundle");
}

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(
  outPath,
  `export const CODEMIRROR_WEB_BUNDLE = ${JSON.stringify(output)};\n`,
  "utf8"
);
