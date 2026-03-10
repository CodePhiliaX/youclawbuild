import { createGeneralPanel, initGeneral } from "./general";
import { createAboutPanel, initAbout } from "./about";

type Tab = "general" | "about";

let overlay: HTMLElement | null = null;
let currentTab: Tab = "general";

function createSettingsModal(): HTMLElement {
  const modal = document.createElement("div");
  modal.id = "settingsOverlay";
  modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";

  modal.innerHTML = `
    <div id="settingsDialog" class="bg-white dark:bg-[#1e1e36] rounded-xl shadow-2xl w-[560px] max-h-[420px] flex overflow-hidden border border-gray-200 dark:border-[#2a2a4a]">
      <!-- Sidebar -->
      <div class="w-[160px] bg-gray-50 dark:bg-[#16162a] p-3 flex flex-col gap-1 border-r border-gray-200 dark:border-[#2a2a4a]">
        <button id="tabGeneral" class="settings-tab text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          General
        </button>
        <button id="tabAbout" class="settings-tab text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          About
        </button>
      </div>
      <!-- Content -->
      <div class="flex-1 p-6 overflow-y-auto" id="settingsContent"></div>
    </div>
  `;

  return modal;
}

function updateTabStyles(): void {
  const tabs = document.querySelectorAll(".settings-tab");
  tabs.forEach((tab) => {
    const el = tab as HTMLElement;
    const isActive = (currentTab === "general" && el.id === "tabGeneral") ||
                     (currentTab === "about" && el.id === "tabAbout");
    if (isActive) {
      el.className = "settings-tab text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-200 dark:bg-[#2a2a4a] text-gray-900 dark:text-white";
    } else {
      el.className = "settings-tab text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-[#888] hover:bg-gray-100 dark:hover:bg-[#22223a]";
    }
  });
}

function showTabContent(tab: Tab): void {
  currentTab = tab;
  const content = document.getElementById("settingsContent");
  if (!content) return;

  content.innerHTML = "";

  if (tab === "general") {
    content.appendChild(createGeneralPanel());
    initGeneral();
  } else {
    content.appendChild(createAboutPanel());
    initAbout();
  }

  updateTabStyles();
}

export function openSettings(tab?: Tab): void {
  if (overlay) return; // Already open

  overlay = createSettingsModal();
  document.body.appendChild(overlay);

  // Close on overlay click (not dialog click)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeSettings();
    }
  });

  // Close on Escape
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSettings();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  // Tab switching
  document.getElementById("tabGeneral")?.addEventListener("click", () => showTabContent("general"));
  document.getElementById("tabAbout")?.addEventListener("click", () => showTabContent("about"));

  // Show initial tab
  showTabContent(tab || "general");
}

export function closeSettings(): void {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

export function initSettingsListener(): void {
  window.electronAPI.onOpenSettings(() => {
    openSettings();
  });
}
