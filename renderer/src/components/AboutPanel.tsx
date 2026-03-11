import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { electronAPI, type UpdateStatusType } from "@/lib/electron";

interface UpdateState {
  status: UpdateStatusType | "idle";
  message: string;
  progress: number;
  newVersion?: string;
}

export function AboutPanel() {
  const [version, setVersion] = useState("");
  const [allowPrerelease, setAllowPrerelease] = useState(false);
  const [update, setUpdate] = useState<UpdateState>({
    status: "idle",
    message: "",
    progress: 0,
  });

  useEffect(() => {
    electronAPI.getVersion().then((v) => setVersion("v" + v));
    electronAPI.getAllowPrerelease().then(setAllowPrerelease);

    const cleanup = electronAPI.onUpdateStatus((status, data) => {
      switch (status) {
        case "checking":
          setUpdate({ status: "checking", message: "Checking for updates...", progress: 0 });
          break;
        case "available":
          setUpdate({ status: "available", message: `Downloading v${data}...`, progress: 0, newVersion: data as string });
          break;
        case "downloading":
          setUpdate((prev) => ({
            ...prev,
            status: "downloading",
            message: `Downloading... ${Math.round(data as number)}%`,
            progress: Math.round(data as number),
          }));
          break;
        case "ready":
          setUpdate({ status: "ready", message: `v${data} ready to install`, progress: 100, newVersion: data as string });
          break;
        case "up-to-date":
          setUpdate({ status: "up-to-date", message: "You are up to date", progress: 0 });
          setTimeout(() => {
            setUpdate({ status: "idle", message: "", progress: 0 });
          }, 3000);
          break;
        case "error":
          setUpdate({ status: "error", message: `Update error: ${data}`, progress: 0 });
          break;
      }
    });

    return cleanup;
  }, []);

  const handleCheck = () => {
    setUpdate({ status: "checking", message: "Checking...", progress: 0 });
    electronAPI.checkForUpdates();
  };

  const handleInstall = () => {
    electronAPI.installUpdate();
  };

  const isChecking = update.status === "checking";
  const showProgress = update.status === "available" || update.status === "downloading";
  const showInstall = update.status === "ready";

  return (
    <div className="flex flex-col items-center pt-8">
      <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">You Claw</h2>
      <p className="text-sm text-gray-500 dark:text-[#888] mb-8">{version}</p>
      <div className="w-full max-w-xs">
        {!showInstall && (
          <Button
            className="w-full"
            onClick={handleCheck}
            disabled={isChecking}
          >
            Check for Updates
          </Button>
        )}
        {showInstall && (
          <Button className="w-full" onClick={handleInstall}>
            Restart & Update
          </Button>
        )}
        {showProgress && (
          <Progress className="mt-3" value={update.progress} />
        )}
        <p className="mt-3 text-sm text-gray-500 dark:text-[#888] min-h-[1.2em] text-center">
          {update.message}
        </p>
      </div>
      <label className="flex items-center gap-3 mt-8 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a4a]">
        <input
          type="checkbox"
          checked={allowPrerelease}
          onChange={(e) => {
            const value = e.target.checked;
            setAllowPrerelease(value);
            electronAPI.setAllowPrerelease(value);
          }}
          className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">
            Beta Updates
          </p>
          <p className="text-xs text-gray-500 dark:text-[#666]">
            Receive pre-release versions for early testing
          </p>
        </div>
      </label>
    </div>
  );
}
