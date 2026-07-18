import { useCallback } from 'react';
import { useConnection } from '../contexts/ConnectionContext';

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: Array<{ path: string; status: string }>;
  unstaged: Array<{ path: string; status: string }>;
  untracked: string[];
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: number;
}

export function useGit() {
  const { sendControl, sendData, status } = useConnection();

  const isConnected = status === 'connected';

  const getStatus = useCallback(async (): Promise<GitStatus> => {
    const response = await sendControl('git', 'status');
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to get git status');
    }
    return response.payload as unknown as GitStatus;
  }, [sendControl]);

  const stage = useCallback(async (paths: string[]): Promise<void> => {
    const response = await sendControl('git', 'stage', { paths });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to stage files');
    }
  }, [sendControl]);

  const unstage = useCallback(async (paths: string[]): Promise<void> => {
    const response = await sendControl('git', 'unstage', { paths });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to unstage files');
    }
  }, [sendControl]);

  const commit = useCallback(async (message: string): Promise<{ hash: string; message: string }> => {
    const response = await sendControl('git', 'commit', { message });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to commit');
    }
    return {
      hash: response.payload.hash as string,
      message: response.payload.message as string,
    };
  }, [sendControl]);

  const log = useCallback(async (limit = 20): Promise<GitCommit[]> => {
    const response = await sendControl('git', 'log', { limit });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to get git log');
    }
    return response.payload.commits as GitCommit[];
  }, [sendControl]);

  const diff = useCallback(async (path?: string, staged = false): Promise<string> => {
    const response = await sendData('git', 'diff', { path, staged });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to get diff');
    }
    return response.payload.diff as string;
  }, [sendData]);

  const getBranches = useCallback(async (): Promise<{ current: string; branches: string[] }> => {
    const response = await sendControl('git', 'branches');
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to get branches');
    }
    return {
      current: response.payload.current as string,
      branches: response.payload.branches as string[],
    };
  }, [sendControl]);

  const checkout = useCallback(async (branch: string): Promise<void> => {
    const response = await sendControl('git', 'checkout', { branch });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to checkout branch');
    }
  }, [sendControl]);

  const deleteBranch = useCallback(async (branch: string): Promise<void> => {
    const response = await sendControl('git', 'deleteBranch', { branch });
    if (!response.ok) {
      throw new Error(response.error?.message || 'Failed to delete branch');
    }
  }, [sendControl]);

  return {
    isConnected,
    getStatus,
    stage,
    unstage,
    commit,
    log,
    diff,
    getBranches,
    checkout,
    deleteBranch,
  };
}
