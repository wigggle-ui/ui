"use client";

import { transformerRenderLineNumber } from "@shikijs/transformers";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { FileTextIcon } from "lucide-react";
import type { JSX } from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import type { BundledLanguage } from "shiki/bundle/web";
import { codeToHast } from "shiki/bundle/web";

import CopyButton from "@/components/copy-button";

const highlight = async (
  code: string,
  lang: BundledLanguage,
  isDark: boolean
) => {
  const hast = await codeToHast(code, {
    lang,
    theme: isDark ? "github-dark" : "github-light",
    transformers: [transformerRenderLineNumber()],
  });

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
};

interface Props {
  code: string | null;
  lang: BundledLanguage;
  initial?: JSX.Element;
  preHighlighted?: JSX.Element | null;
  isFile: string;
}

const CodeBlock = ({ code, lang, initial, preHighlighted, isFile }: Props) => {
  const [isDark, setIsDark] = useState(false);
  const [content, setContent] = useState<JSX.Element | null>(
    preHighlighted ?? initial ?? null
  );

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (preHighlighted || !code) {
      return;
    }

    let isMounted = true;

    const loadHighlight = async () => {
      const result = await highlight(code, lang, isDark);
      if (isMounted) {
        setContent(result);
      }
    };

    void loadHighlight();

    return () => {
      isMounted = false;
    };
  }, [code, lang, preHighlighted, isDark]);

  const displayedContent =
    preHighlighted ??
    (code ? (
      content
    ) : (
      <pre className="bg-primary rounded-md p-4">No code available</pre>
    ));

  return displayedContent ? (
    <div className="border-border bg-code/50 rounded-md border">
      {isFile && code && (
        <div className="flex items-center justify-between px-2.5 py-2">
          <div className="flex items-center justify-start gap-3">
            <FileTextIcon className="text-muted-foreground size-5" />
            <p className="text-muted-foreground">{isFile}</p>
          </div>
          <CopyButton size="icon-sm" text={code} />
        </div>
      )}
      <div className="[&_pre]:bg-code! relative [&_code]:font-mono [&_code]:text-sm [&_pre]:max-h-120 [&_pre]:overflow-auto [&_pre]:rounded-b-md [&_pre]:p-4 [&_pre]:leading-snug">
        {displayedContent}
      </div>
    </div>
  ) : (
    <pre className="bg-primary rounded-md p-4">Loading...</pre>
  );
};

export default CodeBlock;
