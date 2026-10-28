import type { LucideProps } from "lucide-react";
import Link from "next/link";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  slug: string;
  name: string;
  widgetCount?: number;
  isNew?: boolean;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="bg-category-card absolute inset-0 dark:opacity-75"
    />

    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-transparent">
      {children}
    </div>
  </div>
);

const CategoryCard = (props: CategoryCardProps) => {
  const href = `/widgets/${props.slug}`;

  return (
    <div className="space-y-2 text-center">
      <Link
        href={href}
        className="bg-background peer hover:bg-secondary dark:border-border relative mx-auto flex size-52 items-center justify-center overflow-hidden rounded-lg border transition-colors duration-300 sm:flex"
        tabIndex={-1}
      >
        {props.isNew && (
          <Badge className="absolute top-5 left-5 z-10" variant="success">
            New
          </Badge>
        )}
        <Badge
          className="absolute top-5 right-5 z-10 size-8"
          variant="secondary"
        >
          {props.widgetCount}
        </Badge>
        <div className="flex flex-col">
          <CardDecorator>
            <props.icon className="mx-auto size-full" strokeWidth={1.5} />
          </CardDecorator>
          <h2 className="text-foreground text-2xl/[1.1] font-semibold md:text-2xl/[1.1]">
            {props.name}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
