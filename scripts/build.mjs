import { execSync } from "child_process";
import { cpSync } from "fs";

// Compile TypeScript
console.log("Compiling TypeScript...");
execSync("npx tsc", { stdio: "inherit" });

// Copy renderer files to dist
console.log("Copying renderer files...");
cpSync("src/renderer", "dist/renderer", { recursive: true });

console.log("Build complete.");
