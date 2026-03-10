import { execSync } from "child_process";

// Build renderer with Vite
console.log("Building renderer with Vite...");
execSync("npx vite build renderer", { stdio: "inherit" });

// Compile electron (main + preload) TypeScript
console.log("Compiling TypeScript (electron)...");
execSync("npx tsc", { stdio: "inherit" });

console.log("Build complete.");
