import { ReactNode } from "react";
import { RocketIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Icons } from "@/components/icons";

const features = [
  {
    icon: Icons.GitHub,
    title: "Fully Open Source",
    description: "100% free to use. Source code available on GitHub.",
  },
  {
    icon: Icons.shadcn,
    title: "shadcn/ui Compatible",
    description: "Seamlessly integrates with shadcn/ui architecture.",
  },
  {
    icon: RocketIcon,
    title: "Actively Maintained",
    description: "Regular updates, bug fixes, and new features.",
  },
];

export default function Features() {
  return (
    <section className="relative z-10 py-8">
      <div className="@container mx-auto flex max-w-5xl flex-col items-center justify-center gap-12 px-6">
        <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
          Why Wigggle UI?
        </h2>
        <div className="mx-auto grid max-w-sm gap-6 *:text-center @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {features.map((el, i) => (
            <Card key={i} className="group shadow-zinc-950/5">
              <CardHeader>
                <CardDecorator>
                  <el.icon className="size-12" aria-hidden />
                </CardDecorator>

                <h3 className="text-lg font-medium tracking-wider">
                  {el.title}
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-sm">{el.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />

    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-transparent">
      {children}
    </div>
  </div>
);
