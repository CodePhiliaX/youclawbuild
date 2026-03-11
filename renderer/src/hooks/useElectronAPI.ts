export interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => string;
  checkForUpdates: () => void;
  installUpdate: () => void;
  onUpdateStatus: (callback: (status: string, data?: unknown) => void) => void;
  getTheme: () => Promise<string>;
  setTheme: (theme: string) => Promise<void>;
  onOpenSettings: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export function useElectronAPI(): ElectronAPI {
  return window.electronAPI;
}
