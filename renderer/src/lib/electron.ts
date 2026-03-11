import type { Theme } from "@/hooks/useTheme";

export type UpdateStatusType =
  | "checking"
  | "available"
  | "downloading"
  | "ready"
  | "up-to-date"
  | "error";

export interface ElectronAPI {
  // App
  getVersion(): Promise<string>;
  getPlatform(): string;

  // Theme
  getTheme(): Promise<Theme>;
  setTheme(theme: Theme): Promise<void>;

  // Updates
  checkForUpdates(): Promise<string | null>;
  installUpdate(): Promise<void>;
  getAllowPrerelease(): Promise<boolean>;
  setAllowPrerelease(value: boolean): Promise<void>;

  // Events — return cleanup functions
  onUpdateStatus(
    callback: (status: UpdateStatusType, data?: string | number) => void,
  ): () => void;
  onOpenSettings(callback: () => void): () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export const electronAPI = window.electronAPI;
