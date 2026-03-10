import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => ipcRenderer.invoke("get-version"),
  getPlatform: () => process.platform,
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
  onUpdateStatus: (callback: (status: string, data?: unknown) => void) => {
    ipcRenderer.on("update-status", (_event, status, data) => callback(status, data));
  },
  getTheme: () => ipcRenderer.invoke("get-theme"),
  setTheme: (theme: string) => ipcRenderer.invoke("set-theme", theme),
  onOpenSettings: (callback: () => void) => {
    ipcRenderer.on("open-settings", () => callback());
  },
});
