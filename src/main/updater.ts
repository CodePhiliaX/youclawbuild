import { autoUpdater } from "electron-updater";
import { BrowserWindow, dialog } from "electron";
import log from "electron-log";

autoUpdater.logger = log;

export function checkForUpdates(): void {
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    log.error("Failed to check for updates:", err);
  });

  autoUpdater.on("update-available", (info) => {
    log.info("Update available:", info.version);
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No update available.");
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info(`Download speed: ${progress.bytesPerSecond} - ${progress.percent}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    const win = BrowserWindow.getFocusedWindow();
    dialog
      .showMessageBox(win ?? ({} as BrowserWindow), {
        type: "info",
        title: "Update Ready",
        message: `Version ${info.version} has been downloaded. Restart to apply the update.`,
        buttons: ["Restart Now", "Later"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
  });
}
