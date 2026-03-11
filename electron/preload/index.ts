import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // App
  getVersion: () => ipcRenderer.invoke("get-version"),
  getPlatform: () => process.platform,

  // Theme
  getTheme: () => ipcRenderer.invoke("get-theme"),
  setTheme: (theme: string) => ipcRenderer.invoke("set-theme", theme),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
  getAllowPrerelease: () => ipcRenderer.invoke("get-allow-prerelease"),
  setAllowPrerelease: (value: boolean) => ipcRenderer.invoke("set-allow-prerelease", value),

  // Events — return cleanup functions
  onUpdateStatus: (callback: (status: string, data?: unknown) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: string, data?: unknown) =>
      callback(status, data);
    ipcRenderer.on("update-status", handler);
    return () => ipcRenderer.removeListener("update-status", handler);
  },
  onOpenSettings: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("open-settings", handler);
    return () => ipcRenderer.removeListener("open-settings", handler);
  },
});
