"use client";

import { useConfig } from "@/hooks/use-config";
import CopyButton from "@/components/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs";

export default function CliCommands({ name }: { name: string }) {
  const baseURL = "@wigggle-ui";
  const [config, setConfig] = useConfig();
  const packageManager = config.packageManager || "pnpm";

  const commands = {
    pnpm: `pnpm dlx shadcn@latest add ${baseURL}/${name}`,
    npm: `npx shadcn@latest add ${baseURL}/${name}`,
    yarn: `yarn dlx shadcn@latest add ${baseURL}/${name}`,
    bun: `bunx --bun shadcn@latest add ${baseURL}/${name}`,
  };

  return (
    <div className="relative">
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
          });
        }}
        className="rounded-md bg-zinc-950 dark:bg-zinc-900"
      >
        <TabsList className="dark h-auto w-full justify-start rounded-none border-b bg-transparent py-0">
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="pnpm"
          >
            pnpm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="npm"
          >
            npm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="yarn"
          >
            yarn
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-primary relative py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="bun"
          >
            bun
          </TabsTrigger>
        </TabsList>
        {Object.entries(commands).map(([pkg, command]) => (
          <TabsContent className="m-0" key={pkg} value={pkg}>
            <pre className="overflow-auto p-4 text-sm text-yellow-500">
              {command}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
      <div className="absolute top-10 right-0">
        <CopyButton
          widgetName={`${baseURL}/${name}`}
          componentSource={commands[packageManager as keyof typeof commands]}
          className="top-1"
        />
      </div>
    </div>
  );
}
