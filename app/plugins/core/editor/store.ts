export interface EditorController {
  openFile: (path: string) => Promise<void>;
  getOpenFiles: () => string[];
  getCurrentFile: () => string | null;
  insertText: (text: string) => Promise<void>;
  notifyFileRenamed: (from: string, to: string) => Promise<void>;
  notifyFileDeleted: (path: string) => Promise<void>;
}

let controller: EditorController | null = null;
const pendingOpenRequests = new Map<string, Promise<void>>();

export function registerEditorController(nextController: EditorController | null) {
  controller = nextController;
}

export function getEditorController() {
  return controller;
}

export async function openEditorFile(path: string): Promise<void> {
  if (controller) {
    return controller.openFile(path);
  }

  const existing = pendingOpenRequests.get(path);
  if (existing) {
    return existing;
  }

  const pending = new Promise<void>((resolve, reject) => {
    const poll = async () => {
      if (!pendingOpenRequests.has(path)) {
        return;
      }

      if (!controller) {
        setTimeout(poll, 50);
        return;
      }

      try {
        await controller.openFile(path);
        pendingOpenRequests.delete(path);
        resolve();
      } catch (error) {
        pendingOpenRequests.delete(path);
        reject(error);
      }
    };

    void poll();
  });

  pendingOpenRequests.set(path, pending);
  return pending;
}
