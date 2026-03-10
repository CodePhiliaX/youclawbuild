type Theme = "dark" | "light" | "system";

let systemDarkQuery: MediaQueryList;

function applyThemeToDOM(theme: Theme): void {
  const html = document.documentElement;
  if (theme === "system") {
    if (!systemDarkQuery) {
      systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    }
    html.classList.toggle("dark", systemDarkQuery.matches);
  } else if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

export function createGeneralPanel(): HTMLElement {
  const panel = document.createElement("div");
  panel.className = "pt-4";
  panel.innerHTML = `
    <h3 class="text-sm font-medium text-gray-500 dark:text-[#888] uppercase tracking-wide mb-4">Appearance</h3>
    <div class="space-y-2" id="themeOptions">
      <label class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a4a]">
        <input type="radio" name="theme" value="dark" class="accent-[#6c63ff]" />
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">Dark</div>
          <div class="text-xs text-gray-500 dark:text-[#666]">Dark backgrounds with light text</div>
        </div>
      </label>
      <label class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a4a]">
        <input type="radio" name="theme" value="light" class="accent-[#6c63ff]" />
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">Light</div>
          <div class="text-xs text-gray-500 dark:text-[#666]">Light backgrounds with dark text</div>
        </div>
      </label>
      <label class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a4a]">
        <input type="radio" name="theme" value="system" class="accent-[#6c63ff]" />
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">System</div>
          <div class="text-xs text-gray-500 dark:text-[#666]">Follow your system appearance</div>
        </div>
      </label>
    </div>
  `;

  return panel;
}

export function initGeneral(): void {
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');

  // Load saved theme
  window.electronAPI.getTheme().then((theme: string) => {
    const radio = document.querySelector<HTMLInputElement>(`input[name="theme"][value="${theme}"]`);
    if (radio) radio.checked = true;
    applyThemeToDOM(theme as Theme);
  });

  // Handle theme changes
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const theme = radio.value as Theme;
      window.electronAPI.setTheme(theme);
      applyThemeToDOM(theme);
    });
  });

  // Listen for system theme changes
  systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemDarkQuery.addEventListener("change", () => {
    const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
    if (checked?.value === "system") {
      applyThemeToDOM("system");
    }
  });
}

export { applyThemeToDOM, type Theme };
