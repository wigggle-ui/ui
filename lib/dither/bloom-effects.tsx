"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import type { ComponentProps, Ref } from "react";

import { bloomFilter } from "@/lib/dither/style";
import type { Bloom } from "@/lib/dither/style";
import type { DitherColor } from "@/lib/dither/tokens";

import styles from "@/lib/dither/bloom-effects.module.css";

export interface BloomGroupProps extends ComponentProps<"g"> {
  bloom: Bloom;
}

/**
 * An SVG group drawn as a glow: put solid copies of your shapes inside
 * and render it before (under) the real fills. Renders nothing when off.
 */
export const BloomGroup = ({ bloom, className, ...props }: BloomGroupProps) => {
  if (bloom === "off") {
    return null;
  }
  const bloomClass = bloom === "low" ? styles.lowBloom : styles.highBloom;
  return (
    <g
      aria-hidden="true"
      {...props}
      className={`${bloomClass} ${className ?? ""}`}
    />
  );
};

export type BloomBoxProps = ComponentProps<"div"> & {
  /** Glow colour: a palette name or any CSS colour. Default `ink`. */
  color?: DitherColor;
  bloom: Bloom;
};

const setRef = <Element,>(
  ref: Ref<Element> | undefined,
  element: Element | null
) => {
  if (typeof ref === "function") {
    return ref(element);
  } else if (ref) {
    ref.current = element;
  }
};

/**
 * A wrapper that glows around whatever it holds, in `color`. A CSS
 * drop-shadow, so it follows dithered cells and transparent gaps.
 */
export const BloomBox = ({
  color = "ink",
  bloom,
  className,
  ref,
  ...props
}: BloomBoxProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const filter = bloomFilter(color, bloom);
  const combinedRef = useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element;
      const cleanup = setRef(ref, element);
      return () => {
        elementRef.current = null;
        if (typeof cleanup === "function") {
          cleanup();
        } else {
          setRef(ref, null);
        }
      };
    },
    [ref]
  );

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || filter === undefined) {
      return;
    }
    element.style.setProperty("--dither-bloom-filter", filter);
    return () => {
      element.style.removeProperty("--dither-bloom-filter");
    };
  }, [filter]);

  return (
    <div
      {...props}
      ref={combinedRef}
      className={`${filter === undefined ? "" : styles.bloomBox} ${className ?? ""}`}
    />
  );
};
