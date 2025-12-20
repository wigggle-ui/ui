import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { cn } from "@/registry/default/lib/utils";

import { Button } from "@/registry/default/ui/button";
import { Callout } from "@/components/callout";
import CliCommands from "@/components/cli-commands";
import CodeBlock, { highlight } from "@/components/code-block";
import CopyButton from "@/components/copy-button";
import { Separator } from "@/components/ui/separator";
import { TypeTable } from "./components/type-table";
import WidgetCard from "@/components/widget-card";
import WidgetLoader from "@/components/widget-loader-client";
import WidgetDetails from "@/components/widget-details";

export const mdxComponents: MDXComponents = {
  h1: ({ className, children, ...props }: React.ComponentProps<"h1">) => {
    const id = children
      ?.toString()
      .replace(/\s+/g, "-")
      .replace(/'/g, "")
      .replace(/\?/g, "")
      .toLowerCase();
    return (
      <h1
        id={id}
        className={cn(
          "font-heading scroll-m-12 border-b-2 pb-2 text-3xl font-bold tracking-tight not-first:mt-12",
          className,
        )}
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => {
    return (
      <h2
        id={props.children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase()}
        className={cn(
          "font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-6 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!",
          className,
        )}
        {...props}
      />
    );
  },
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:mt-4! *:[code]:text-xl",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("leading-relaxed not-first:mt-6", className)} {...props} />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    <img className={cn("rounded-md", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="no-scrollbar my-6 w-full overflow-y-auto rounded-lg border">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0",
          className,
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr className={cn("m-0 border-b", className)} {...props} />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "px-4 py-2 text-left whitespace-nowrap [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
    return (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0 has-data-[slot=tabs]:p-0",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
    return <figure className={cn(className)} {...props} />;
  },
  Button,
  Callout,
  CliCommands,
  CodeBlock,
  CopyButton,
  Link,
  Separator,
  TypeTable,
  WidgetCard,
  WidgetLoader,
  WidgetDetails,
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
