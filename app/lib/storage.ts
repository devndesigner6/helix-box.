import { File, Directory, Paths } from 'expo-file-system/next';

// Base storage directory
const STORAGE_DIR = new Directory(Paths.document, 'lunel-editor');

export interface StorageFileInfo {
  name: string;
  size: number;
}

class JsonStorage {
  private getFile(name: string): File {
    const filename = name.endsWith('.json') ? name : `${name}.json`;
    return new File(STORAGE_DIR, filename);
  }

  async ensureDir(): Promise<void> {
    if (!STORAGE_DIR.exists) {
      await STORAGE_DIR.create();
    }
  }

  async list(): Promise<StorageFileInfo[]> {
    try {
      if (!STORAGE_DIR.exists) return [];

      const files: StorageFileInfo[] = [];
      const entries = STORAGE_DIR.list();
      for (const entry of entries) {
        if (entry instanceof File && entry.name?.endsWith('.json')) {
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
    try {
      const file = this.getFile(name);
      if (!file.exists) return null;
      const content = await file.text();
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Failed to read ${name}:`, error);
      return null;
    }
  }

  async write<T>(name: string, data: T): Promise<boolean> {
    try {
      await this.ensureDir();
      const file = this.getFile(name);
      await file.write(JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write ${name}:`, error);
      return false;
    }
  }

  async delete(name: string): Promise<boolean> {
    try {
      const file = this.getFile(name);
      if (file.exists) {
        await file.delete();
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete ${name}:`, error);
      return false;
    }
  }

  async exists(name: string): Promise<boolean> {
    const file = this.getFile(name);
    return file.exists;
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
