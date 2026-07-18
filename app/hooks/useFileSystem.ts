import { useCallback } from 'react';
import { useConnection } from '../contexts/ConnectionContext';

export interface FileEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  mtime?: number;
}

export interface FileStat {
  path: string;
  type: 'file' | 'directory';
  size: number;
  mtime: number;
  mode: number;
}

export interface GrepMatch {
  file: string;
  line: number;
  content: string;
}

export function useFileSystem() {
  const { sendControl, sendData, status } = useConnection();

  const isConnected = status === 'connected';

  const ls = useCallback(async (path = '.'): Promise<FileEntry[]> => {
    const response = await sendControl('fs', 'ls', { path });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to list directory');
    }
    return response.payload.entries as FileEntry[];
  }, [sendControl]);

  const stat = useCallback(async (path: string): Promise<FileStat> => {
    const response = await sendControl('fs', 'stat', { path });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to stat file');
    }
    return response.payload as unknown as FileStat;
  }, [sendControl]);

  const read = useCallback(async (path: string): Promise<{ content: string; encoding: string }> => {
    const response = await sendData('fs', 'read', { path });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to read file');
    }
    return {
      content: response.payload.content as string,
      encoding: response.payload.encoding as string,
    };
  }, [sendData]);

  const write = useCallback(async (path: string, content: string, encoding = 'utf8'): Promise<void> => {
    const response = await sendData('fs', 'write', { path, content, encoding });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to write file');
    }
  }, [sendData]);

  const mkdir = useCallback(async (path: string, recursive = true): Promise<void> => {
    const response = await sendControl('fs', 'mkdir', { path, recursive });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to create directory');
    }
  }, [sendControl]);

  const rm = useCallback(async (path: string, recursive = false): Promise<void> => {
    const response = await sendControl('fs', 'rm', { path, recursive });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to remove file');
    }
  }, [sendControl]);

  const mv = useCallback(async (from: string, to: string): Promise<void> => {
    const response = await sendControl('fs', 'mv', { from, to });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to move file');
    }
  }, [sendControl]);

  const grep = useCallback(async (
    pattern: string,
    path = '.',
    options: { caseSensitive?: boolean; maxResults?: number } = {}
  ): Promise<GrepMatch[]> => {
    const response = await sendControl('fs', 'grep', {
      path,
      pattern,
      caseSensitive: options.caseSensitive ?? true,
      maxResults: options.maxResults ?? 100,
    });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to search');
    }
    return response.payload.matches as GrepMatch[];
  }, [sendControl]);

  return {
    isConnected,
    ls,
    stat,
    read,
    write,
    mkdir,
    rm,
    mv,
    grep,
  };
}
