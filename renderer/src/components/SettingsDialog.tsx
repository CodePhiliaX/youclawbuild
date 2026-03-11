import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { BasePanel } from "./GeneralPanel";
import { AboutPanel } from "./AboutPanel";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

type Tab = "base" | "about";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "base", label: "Base" },
  { id: "about", label: "About" },
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [currentTab, setCurrentTab] = useState<Tab>("base");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[560px] max-h-[420px] p-0 flex overflow-hidden">
        {/* Close button */}
        <DialogClose className="absolute right-3 top-3 p-1 rounded-md text-gray-400 dark:text-[#666] hover:text-gray-600 dark:hover:text-[#aaa] hover:bg-gray-200 dark:hover:bg-[#2a2a4a] transition-colors">
          <X size={16} />
        </DialogClose>

        {/* Sidebar */}
        <div className="w-[160px] bg-gray-50 dark:bg-[#16162a] p-3 flex flex-col gap-1 border-r border-gray-200 dark:border-[#2a2a4a]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentTab === tab.id
                  ? "bg-gray-200 dark:bg-[#2a2a4a] text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-[#888] hover:bg-gray-100 dark:hover:bg-[#22223a]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentTab === "base" ? <BasePanel /> : <AboutPanel />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
