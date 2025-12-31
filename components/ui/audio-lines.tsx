"use client";

import type { HTMLAttributes } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { motion, useAnimation } from "motion/react";

import { cn } from "@/lib/utils";

export interface AudioLinesIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AudioLinesIconProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  size?: number;
}

const AudioLinesIcon = forwardRef<AudioLinesIconHandle, AudioLinesIconProps>(
  ({ animate = true, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useEffect(() => {
      if (animate) controls.start("animate");
      else controls.start("normal");
    }, [animate]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

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
        >
          <path d="M2 10v3" />
          <motion.path
            variants={{
              normal: { d: "M6 6v11" },
              animate: {
                d: ["M6 6v11", "M6 10v3", "M6 6v11"],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                },
              },
            }}
            d="M6 6v11"
            animate={controls}
          />
          <motion.path
            variants={{
              normal: { d: "M10 3v18" },
              animate: {
                d: ["M10 3v18", "M10 9v5", "M10 3v18"],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                },
              },
            }}
            d="M10 3v18"
            animate={controls}
          />
          <motion.path
            variants={{
              normal: { d: "M14 8v7" },
              animate: {
                d: ["M14 8v7", "M14 6v11", "M14 8v7"],
                transition: {
                  duration: 0.8,
                  repeat: Infinity,
                },
              },
            }}
            d="M14 8v7"
            animate={controls}
          />
          <motion.path
            variants={{
              normal: { d: "M18 5v13" },
              animate: {
                d: ["M18 5v13", "M18 7v9", "M18 5v13"],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                },
              },
            }}
            d="M18 5v13"
            animate={controls}
          />
          <path d="M22 10v3" />
        </svg>
      </div>
    );
  },
);

AudioLinesIcon.displayName = "AudioLinesIcon";

export { AudioLinesIcon };
