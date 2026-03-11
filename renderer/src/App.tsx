import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { SettingsDialog } from "./components/SettingsDialog";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [version, setVersion] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  useTheme();

  useEffect(() => {
    window.electronAPI.getVersion().then((v) => {
      setVersion("v" + v);
    });

    window.electronAPI.onOpenSettings(() => {
      setSettingsOpen(true);
    });
  }, []);

  return (
    <>
      {/* Titlebar drag region */}
      <div className="fixed top-0 left-0 right-0 h-[38px] [-webkit-app-region:drag]" />

      {/* Settings gear button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="[-webkit-app-region:no-drag] fixed top-[10px] right-[16px] z-10 p-2 rounded-lg text-gray-400 dark:text-[#666] hover:text-gray-600 dark:hover:text-[#aaa] hover:bg-gray-200 dark:hover:bg-[#2a2a4a] transition-colors"
        title="Settings"
      >
        <Settings size={18} />
      </button>

      {/* Home page content */}
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">You Claw</h1>
        <p className="text-lg text-gray-500 dark:text-[#888]">{version}</p>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
