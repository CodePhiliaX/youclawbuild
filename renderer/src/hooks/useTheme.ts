import { useEffect } from "react";
import { electronAPI } from "@/lib/electron";

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
    electronAPI.getTheme().then((theme) => {
      applyThemeToDOM(theme);
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      electronAPI.getTheme().then((theme) => {
        if (theme === "system") {
          applyThemeToDOM("system");
        }
      });
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
}
