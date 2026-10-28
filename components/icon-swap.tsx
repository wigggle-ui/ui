"use client";

import type { AnimatePresenceProps, HTMLMotionProps } from "motion/react";
import { AnimatePresence, motion } from "motion/react";

const IconSwap = (props: React.PropsWithChildren<AnimatePresenceProps>) => (
  <AnimatePresence mode="popLayout" initial={false} {...props} />
);

type MotionElement = typeof motion.div | typeof motion.span;

const IconSwapItem = ({
  as: Component = motion.div,
  ...props
}: HTMLMotionProps<"div"> & {
  as?: MotionElement;
}) => (
  <Component
    initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
    animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
    exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
    transition={{
      bounce: 0,
      duration: 0.3,
      type: "spring",
    }}
    {...props}
  />
);

export { IconSwap, IconSwapItem };
