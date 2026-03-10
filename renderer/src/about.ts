export function createAboutPanel(): HTMLElement {
  const panel = document.createElement("div");
  panel.className = "flex flex-col items-center pt-8";
  panel.innerHTML = `
    <h2 class="text-2xl font-bold mb-1 text-gray-900 dark:text-white">You Claw</h2>
    <p class="text-sm text-gray-500 dark:text-[#888] mb-8" id="aboutVersion"></p>
    <div class="w-full max-w-xs">
      <button
        class="w-full bg-gray-100 dark:bg-[#2a2a4a] text-gray-700 dark:text-[#e0e0e0] border border-gray-300 dark:border-[#3a3a5a] px-5 py-2 rounded-md cursor-pointer text-sm transition-colors hover:bg-gray-200 dark:hover:bg-[#3a3a5a] disabled:opacity-50 disabled:cursor-not-allowed"
        id="aboutCheckBtn"
      >
        Check for Updates
      </button>
      <button
        class="w-full bg-gray-100 dark:bg-[#2a2a4a] text-gray-700 dark:text-[#e0e0e0] border border-gray-300 dark:border-[#3a3a5a] px-5 py-2 rounded-md cursor-pointer text-sm transition-colors hover:bg-gray-200 dark:hover:bg-[#3a3a5a] hidden"
        id="aboutInstallBtn"
      >
        Restart &amp; Update
      </button>
      <div class="w-full h-1 bg-gray-200 dark:bg-[#2a2a4a] rounded-sm mt-3 overflow-hidden hidden" id="aboutProgressBar">
        <div class="h-full bg-[#6c63ff] rounded-sm w-0 transition-all duration-300" id="aboutProgressFill"></div>
      </div>
      <p class="mt-3 text-sm text-gray-500 dark:text-[#888] min-h-[1.2em] text-center" id="aboutUpdateStatus"></p>
    </div>
  `;

  return panel;
}

export function initAbout(): void {
  const checkBtn = document.getElementById("aboutCheckBtn") as HTMLButtonElement;
  const installBtn = document.getElementById("aboutInstallBtn") as HTMLButtonElement;
  const statusEl = document.getElementById("aboutUpdateStatus") as HTMLParagraphElement;
  const progressBar = document.getElementById("aboutProgressBar") as HTMLDivElement;
  const progressFill = document.getElementById("aboutProgressFill") as HTMLDivElement;
  const versionEl = document.getElementById("aboutVersion") as HTMLParagraphElement;

  window.electronAPI.getVersion().then((v) => {
    versionEl.textContent = "v" + v;
  });

  checkBtn.addEventListener("click", () => {
    checkBtn.disabled = true;
    statusEl.textContent = "Checking...";
    window.electronAPI.checkForUpdates();
  });

  installBtn.addEventListener("click", () => {
    window.electronAPI.installUpdate();
  });

  window.electronAPI.onUpdateStatus((status, data) => {
    switch (status) {
      case "checking":
        statusEl.textContent = "Checking for updates...";
        checkBtn.disabled = true;
        progressBar.classList.add("hidden");
        break;
      case "available":
        statusEl.textContent = "Downloading v" + data + "...";
        progressBar.classList.remove("hidden");
        break;
      case "downloading":
        progressFill.style.width = Math.round(data as number) + "%";
        statusEl.textContent = "Downloading... " + Math.round(data as number) + "%";
        break;
      case "ready":
        statusEl.textContent = "v" + data + " ready to install";
        progressBar.classList.add("hidden");
        checkBtn.classList.add("hidden");
        installBtn.classList.remove("hidden");
        break;
      case "up-to-date":
        statusEl.textContent = "You are up to date";
        checkBtn.disabled = false;
        progressBar.classList.add("hidden");
        setTimeout(() => {
          statusEl.textContent = "";
        }, 3000);
        break;
      case "error":
        statusEl.textContent = "Update error: " + data;
        checkBtn.disabled = false;
        progressBar.classList.add("hidden");
        break;
    }
  });
}
