import { Platform } from 'react-native';

let FileClass: any = null;
let DirectoryClass: any = null;
let PathsObj: any = null;

if (Platform.OS !== 'web') {
  try {
    const nextModule = require('expo-file-system/next');
    FileClass = nextModule.File;
    DirectoryClass = nextModule.Directory;
    PathsObj = nextModule.Paths;
  } catch (e) {
    console.warn('Failed to load expo-file-system native module', e);
  }
}

// Base storage directory
const STORAGE_DIR = (Platform.OS !== 'web' && DirectoryClass && PathsObj)
  ? new DirectoryClass(PathsObj.document, 'lunel-editor')
  : null;

export interface StorageFileInfo {
  name: string;
  size: number;
}

class JsonStorage {
  private getFile(name: string): any {
    if (Platform.OS === 'web' || !FileClass || !STORAGE_DIR) return null;
    const filename = name.endsWith('.json') ? name : `${name}.json`;
    return new FileClass(STORAGE_DIR, filename);
  }

  async ensureDir(): Promise<void> {
    if (Platform.OS === 'web' || !STORAGE_DIR) return;
    if (!STORAGE_DIR.exists) {
      await STORAGE_DIR.create();
    }
  }

  async list(): Promise<StorageFileInfo[]> {
    if (Platform.OS === 'web') {
      try {
        const keys = Object.keys(localStorage);
        const files: StorageFileInfo[] = [];
        for (const key of keys) {
          if (key.startsWith('lunel-editor:')) {
            const name = key.replace('lunel-editor:', '');
            const val = localStorage.getItem(key) || '';
            files.push({
              name,
              size: val.length,
            });
          }
        }
        return files;
      } catch {
        return [];
      }
    }

    try {
      if (!STORAGE_DIR || !STORAGE_DIR.exists) return [];

      const files: StorageFileInfo[] = [];
      const entries = STORAGE_DIR.list();
      for (const entry of entries) {
        if (FileClass && entry instanceof FileClass && entry.name?.endsWith('.json')) {
          files.push({
            name: entry.name,
            size: entry.size ?? 0,
          });
        }
      }
      return files;
    } catch (error) {
      console.error('Failed to list storage files:', error);
      return [];
    }
  }

  async read<T = unknown>(name: string): Promise<T | null> {
    const keyName = name.endsWith('.json') ? name : `${name}.json`;

    if (Platform.OS === 'web') {
      try {
        const content = localStorage.getItem(`lunel-editor:${keyName}`);
        if (!content) return null;
        return JSON.parse(content) as T;
      } catch {
        return null;
      }
    }

    try {
      const file = this.getFile(name);
      if (!file || !file.exists) return null;
      const content = await file.text();
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Failed to read ${name}:`, error);
      return null;
    }
  }

  async write<T>(name: string, data: T): Promise<boolean> {
    const keyName = name.endsWith('.json') ? name : `${name}.json`;

    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(`lunel-editor:${keyName}`, JSON.stringify(data, null, 2));
        return true;
      } catch {
        return false;
      }
    }

    try {
      await this.ensureDir();
      const file = this.getFile(name);
      if (!file) return false;
      await file.write(JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write ${name}:`, error);
      return false;
    }
  }

  async delete(name: string): Promise<boolean> {
    const keyName = name.endsWith('.json') ? name : `${name}.json`;

    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(`lunel-editor:${keyName}`);
        return true;
      } catch {
        return false;
      }
    }

    try {
      const file = this.getFile(name);
      if (file && file.exists) {
        await file.delete();
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete ${name}:`, error);
      return false;
    }
  }

  async exists(name: string): Promise<boolean> {
    const keyName = name.endsWith('.json') ? name : `${name}.json`;

    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(`lunel-editor:${keyName}`) !== null;
      } catch {
        return false;
      }
    }

    const file = this.getFile(name);
    return file ? file.exists : false;
  }
}

class LunelStorage {
  readonly jsons = new JsonStorage();
}

// Global singleton
export const lunelStorage = new LunelStorage();

// Also export as part of a larger API namespace for future expansion
export const lunelApi = {
  storage: lunelStorage,
};
