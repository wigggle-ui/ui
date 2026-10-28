"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes, Ref } from "react";
import { useEffect, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

export interface AudioLinesIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AudioLinesIconProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  ref?: Ref<AudioLinesIconHandle>;
  size?: number;
}

const AudioLinesIcon = ({
  animate = true,
  className,
  ref,
  size = 28,
  ...props
}: AudioLinesIconProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(animate ? "animate" : "normal");
  }, [animate, controls]);

  useImperativeHandle(
    ref,
    () => ({
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }),
    [controls]
  );

  return (
    <div className={cn(className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 10v3" />
        <motion.path
          variants={{
            animate: {
              d: ["M6 6v11", "M6 10v3", "M6 6v11"],
              transition: {
                duration: 1.5,
                repeat: Infinity,
              },
            },
            normal: { d: "M6 6v11" },
          }}
          d="M6 6v11"
          animate={controls}
        />
        <motion.path
          variants={{
            animate: {
              d: ["M10 3v18", "M10 9v5", "M10 3v18"],
              transition: {
                duration: 1,
                repeat: Infinity,
              },
            },
            normal: { d: "M10 3v18" },
          }}
          d="M10 3v18"
          animate={controls}
        />
        <motion.path
          variants={{
            animate: {
              d: ["M14 8v7", "M14 6v11", "M14 8v7"],
              transition: {
                duration: 0.8,
                repeat: Infinity,
              },
            },
            normal: { d: "M14 8v7" },
          }}
          d="M14 8v7"
          animate={controls}
        />
        <motion.path
          variants={{
            animate: {
              d: ["M18 5v13", "M18 7v9", "M18 5v13"],
              transition: {
                duration: 1.5,
                repeat: Infinity,
              },
            },
            normal: { d: "M18 5v13" },
          }}
          d="M18 5v13"
          animate={controls}
        />
        <path d="M22 10v3" />
      </svg>
    </div>
  );
};

export { AudioLinesIcon };
