import { useEffect } from "react";

export type Theme = "dark" | "light" | "system";

export function applyThemeToDOM(theme: Theme): void {
  const html = document.documentElement;
  if (theme === "system") {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.classList.toggle("dark", systemDark);
  } else if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

export function useTheme(): void {
  useEffect(() => {
    // Apply saved theme on load
    window.electronAPI.getTheme().then((theme) => {
      applyThemeToDOM(theme as Theme);
    });

    // Listen for system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      window.electronAPI.getTheme().then((theme) => {
        if (theme === "system") {
          applyThemeToDOM("system");
        }
      });
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
}
