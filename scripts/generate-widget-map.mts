import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("registry/default/widgets");
const output = path.resolve("registry/default/widget-map.ts");

const findWidgets = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findWidgets(fullPath);
      }

      return entry.name.endsWith(".tsx") ? [fullPath] : [];
    })
  );

  return files.flat();
};

const foundFiles = await findWidgets(root);
// const files = foundFiles.toSorted();

const files = foundFiles
  .filter((file) => !file.includes(`${path.sep}weather${path.sep}`))
  .toSorted();

const entries = files
  .map((file) => {
    const relativePath = path
      .relative(process.cwd(), file)
      .replaceAll(path.sep, "/");

    const importPath = `@/registry/default/widgets/${path
      .relative(root, file)
      .replaceAll(path.sep, "/")
      .replace(/\.tsx$/u, "")}`;

    return `  ["${relativePath}", () => import("${importPath}")],`;
  })
  .join("\n");

const content = `export const widgetMap = new Map([\n${entries}\n]);\n`;

await writeFile(output, content);

console.log(`Generated widget map for ${files.length} widgets.`);
