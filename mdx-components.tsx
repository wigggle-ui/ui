import { cn } from "cn";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import CodeBlock from "@/components/code-block";
import { CodeBlockCommand } from "@/components/code-block-command";
import CopyButton from "@/components/copy-button";
import ForNerds from "@/components/for-nerds";
import TypeTable from "@/components/type-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Step, Steps } from "@/components/ui/step";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsIndicator,
} from "@/components/ui/tabs";
import WidgetCard from "@/components/widget-card";
import WidgetLoader from "@/components/widget-loader-client";

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return "";
};

const getHeadingId = (children: React.ReactNode) => {
  const id = getNodeText(children)
    .trim()
    .replaceAll(/\s+/gu, "-")
    .replaceAll("'", "")
    .replaceAll("?", "")
    .toLowerCase();

  return id || undefined;
};

const HeadingAnchor = ({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) => {
  if (!id) {
    return children;
  }

  return (
    <a className="group no-underline" href={`#${id}`}>
      <span className="underline-offset-4 group-hover:underline">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="text-muted-foreground ml-2 opacity-0 group-hover:opacity-100"
      >
        #
      </span>
    </a>
  );
};

export const mdxComponents: MDXComponents = {
  Button,
  CodeBlock,
  CodeBlockCommand,
  CopyButton,
  ForNerds,
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-2xl border", className)}
      src={(src as string) || ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt || ""}
      {...props}
    />
  ),
  Link,
  Separator,
  Step,
  Steps,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TypeTable,
  WidgetCard,
  WidgetLoader,
  a: ({ className, children, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
    <figure className={cn(className)} {...props} />
  ),
  h1: ({ children, className, id, ...props }: React.ComponentProps<"h1">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h1
        id={headingId}
        className={cn(
          "scroll-mt-20 text-3xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h1>
    );
  },
  h2: ({ children, id, ...props }: React.ComponentProps<"h2">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h2 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h2>
    );
  },
  h3: ({ children, id, ...props }: React.ComponentProps<"h3">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h3 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h3>
    );
  },
  h4: ({ children, id, ...props }: React.ComponentProps<"h4">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h4 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h4>
    );
  },
  h5: ({ children, id, ...props }: React.ComponentProps<"h5">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h5 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h5>
    );
  },
  h6: ({ children, id, ...props }: React.ComponentProps<"h6">) => {
    const headingId = id ?? getHeadingId(children);

    return (
      <h6 id={headingId} {...props}>
        <HeadingAnchor id={headingId}>{children}</HeadingAnchor>
      </h6>
    );
  },
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p className={cn("leading-relaxed not-first:mt-6", className)} {...props} />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0 has-data-[slot=tabs]:p-0",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0",
          className
        )}
        {...props}
      />
    </div>
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "px-4 py-2 text-left whitespace-nowrap [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr className={cn("m-0 border-b", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
};

const useMDXComponents = (): MDXComponents => mdxComponents;

export { useMDXComponents };
