import "./style.css";
import { openSettings, initSettingsListener } from "./settings";
import { applyThemeToDOM, type Theme } from "./general";

declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getPlatform: () => string;
      checkForUpdates: () => void;
      installUpdate: () => void;
      onUpdateStatus: (callback: (status: string, data?: unknown) => void) => void;
      getTheme: () => Promise<string>;
      setTheme: (theme: string) => Promise<void>;
      onOpenSettings: (callback: () => void) => void;
    };
  }
}

// Display version on home page
const versionEl = document.getElementById("version") as HTMLParagraphElement;
window.electronAPI.getVersion().then((v) => {
  versionEl.textContent = "v" + v;
});

// Apply saved theme on load
window.electronAPI.getTheme().then((theme) => {
  applyThemeToDOM(theme as Theme);
});

// Settings gear button
const settingsBtn = document.getElementById("settingsBtn") as HTMLButtonElement;
settingsBtn.addEventListener("click", () => {
  openSettings();
});

// Listen for menu-triggered settings open
initSettingsListener();
