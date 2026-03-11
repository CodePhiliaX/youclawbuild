import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { applyThemeToDOM, type Theme } from "../hooks/useTheme";
import { electronAPI } from "@/lib/electron";

const themeOptions: { value: Theme; label: string; description: string }[] = [
  { value: "dark", label: "Dark", description: "Dark backgrounds with light text" },
  { value: "light", label: "Light", description: "Light backgrounds with dark text" },
  { value: "system", label: "System", description: "Follow your system appearance" },
];

export function BasePanel() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    electronAPI.getTheme().then(setTheme);
  }, []);

  const handleThemeChange = (value: string) => {
    const newTheme = value as Theme;
    setTheme(newTheme);
    electronAPI.setTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  return (
    <div className="pt-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-[#888] uppercase tracking-wide mb-4">
        Appearance
      </h3>
      <RadioGroup value={theme} onValueChange={handleThemeChange}>
        {themeOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a4a]"
          >
            <RadioGroupItem value={option.value} />
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-[#e0e0e0] cursor-pointer">
                {option.label}
              </Label>
              <div className="text-xs text-gray-500 dark:text-[#666]">{option.description}</div>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
