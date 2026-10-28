"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

export const getFileContent = async (file: string) => {
  const filePath = path.join(process.cwd(), "registry", "default", "ui", file);
  return await fs.readFile(filePath, "utf-8");
};
