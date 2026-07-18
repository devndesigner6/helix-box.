export type DiffAction = "edited" | "added" | "deleted" | "renamed";

export type DiffChunk = {
  id: string;
  path: string;
  action: DiffAction;
  additions: number;
  deletions: number;
  diffCode: string;
};

export function looksLikeDiff(text: string | null): text is string {
  if (!text) return false;
  return text.includes("```diff") || text.includes("diff --git ") || text.includes("\n@@ ");
}

export function parseDiffChunks(text: string): DiffChunk[] {
  const normalized = text.trim();
  if (!normalized) return [];

  const pathSections = normalized
    .split(/\n---\n|\n\n---\n\n/g)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section, index) => {
      const pathMatch = section.match(/(?:^|\n)Path:\s*(.+)/);
      const kindMatch = section.match(/(?:^|\n)Kind:\s*(.+)/);
      const diffMatch = section.match(/```diff\n([\s\S]*?)\n```/);
      if (!pathMatch || !diffMatch) return null;

      const diffCode = diffMatch[1].trim();
      const path = pathMatch[1].trim();
      const kind = (kindMatch?.[1] || "update").trim().toLowerCase();
      return makeDiffChunk({
        id: `section:${index}:${path}`,
        path,
        kind,
        diffCode,
      });
    })
    .filter((value): value is DiffChunk => Boolean(value));

  if (pathSections.length > 0) {
    return pathSections;
  }

  const fencedMatch = normalized.match(/```diff\n([\s\S]*?)\n```/);
  const rawDiff = fencedMatch ? fencedMatch[1].trim() : normalized;
  if (!rawDiff.includes("diff --git ") && !rawDiff.includes("\n@@ ")) {
    return [];
  }

  const fileChunks = splitUnifiedDiffByFile(rawDiff);
  return fileChunks.map((chunk, index) =>
    makeDiffChunk({
      id: `patch:${index}:${chunk.path}`,
      path: chunk.path,
      kind: inferDiffAction(chunk.diff),
      diffCode: chunk.diff,
    })
  );
}

export function classifyDiffLine(line: string) {
  if (line.startsWith("@@")) return "hunk";
  if (line.startsWith("diff ") || line.startsWith("index ") || line.startsWith("---") || line.startsWith("+++")) return "meta";
  if (line.startsWith("+") && !line.startsWith("+++")) return "addition";
  if (line.startsWith("-") && !line.startsWith("---")) return "deletion";
  return "neutral";
}

function splitUnifiedDiffByFile(diff: string): Array<{ path: string; diff: string }> {
  const lines = diff.split("\n");
  const chunks: Array<{ path: string; diff: string }> = [];
  let currentLines: string[] = [];
  let currentPath: string | null = null;

  const flush = () => {
    if (currentLines.length === 0) return;
    const diffText = currentLines.join("\n").trim();
    if (!diffText) {
      currentLines = [];
      return;
    }
    chunks.push({
      path: currentPath || parsePathFromDiffLines(currentLines) || "unknown",
      diff: diffText,
    });
    currentLines = [];
  };

  for (const line of lines) {
    if (line.startsWith("diff --git ") && currentLines.length > 0) {
      flush();
      currentPath = null;
    }

    if (!currentPath) {
      currentPath = parsePathFromDiffLine(line);
    }
    currentLines.push(line);
  }

  flush();
  return chunks;
}

function parsePathFromDiffLines(lines: string[]): string | null {
  for (const line of lines) {
    const parsed = parsePathFromDiffLine(line);
    if (parsed) return parsed;
  }
  return null;
}

function parsePathFromDiffLine(line: string): string | null {
  if (line.startsWith("diff --git ")) {
    const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (match) return match[2].trim();
  }
  if (line.startsWith("+++ ")) {
    const raw = line.slice(4).trim();
    if (raw === "/dev/null") return null;
    return raw.replace(/^b\//, "");
  }
  if (line.startsWith("--- ")) {
    const raw = line.slice(4).trim();
    if (raw === "/dev/null") return null;
    return raw.replace(/^a\//, "");
  }
  return null;
}

function inferDiffAction(diff: string): DiffAction {
  if (diff.includes("new file mode")) return "added";
  if (diff.includes("deleted file mode")) return "deleted";
  if (diff.includes("rename from ") || diff.includes("rename to ")) return "renamed";
  return "edited";
}

function makeDiffChunk({
  id,
  path,
  kind,
  diffCode,
}: {
  id: string;
  path: string;
  kind: string;
  diffCode: string;
}): DiffChunk {
  let additions = 0;
  let deletions = 0;
  for (const line of diffCode.split("\n")) {
    if (line.startsWith("+") && !line.startsWith("+++")) additions += 1;
    if (line.startsWith("-") && !line.startsWith("---")) deletions += 1;
  }

  const action = kind.includes("add")
    ? "added"
    : kind.includes("delete") || kind.includes("remove")
      ? "deleted"
      : kind.includes("rename")
        ? "renamed"
        : inferDiffAction(diffCode);

  return { id, path, action, additions, deletions, diffCode };
}
