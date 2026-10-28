import { promises as fs } from "node:fs";
import path from "node:path";

const buildRegistryJsonFile = async (): Promise<void> => {
  const cwd = process.cwd();
  const src = path.join(cwd, "registry.json");
  const destDir = path.join(cwd, "public", "r");
  const dest = path.join(destDir, "registry.json");

  await fs.copyFile(src, dest);
  console.log("✔ Copied registry.json to public/r");
};

try {
  await buildRegistryJsonFile();
  console.log("✔ Registry updated successfully.");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("❌ Failed to copy registry.json:", message);
  process.exitCode = 1;
}
