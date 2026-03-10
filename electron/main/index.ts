import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, nativeTheme } from "electron";
import path from "path";
import fs from "fs";
import { setupUpdater, checkForUpdates } from "./updater";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Theme persistence
const themeFilePath = path.join(app.getPath("userData"), "theme.json");

function getSavedTheme(): string {
  try {
    const data = fs.readFileSync(themeFilePath, "utf-8");
    const parsed = JSON.parse(data);
    if (["dark", "light", "system"].includes(parsed.theme)) {
      return parsed.theme;
    }
  } catch {
    // File doesn't exist or invalid, default to system
  }
  return "system";
}

function saveTheme(theme: string): void {
  fs.writeFileSync(themeFilePath, JSON.stringify({ theme }), "utf-8");
}

function applyTheme(theme: string): void {
  if (theme === "system") {
    nativeTheme.themeSource = "system";
  } else if (theme === "light") {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
}

function createTray(): void {
  const iconPath = path.join(__dirname, "../../../resources/logo.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip("You Claw");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Window",
      click: () => {
        mainWindow?.show();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow?.show();
  });
}

function createAppMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        {
          label: "Settings...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            mainWindow?.show();
            mainWindow?.webContents.send("open-settings");
          },
        },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { role: "close" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: "#1a1a2e",
    title: "You Claw",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../../renderer/index.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Apply saved theme
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  ipcMain.handle("get-version", () => app.getVersion());

  ipcMain.handle("get-theme", () => getSavedTheme());

  ipcMain.handle("set-theme", (_event, theme: string) => {
    saveTheme(theme);
    applyTheme(theme);
  });

  setupUpdater();
  createAppMenu();
  createTray();
  createWindow();

  if (app.isPackaged) {
    checkForUpdates();
  }

  app.on("activate", () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
