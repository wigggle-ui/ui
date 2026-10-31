"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { IconSwap, IconSwapItem } from "@/components/icon-swap";
import { Icons } from "@/components/icons";

const LOGOS = [Icons.Logo, Icons.LogoCobweb, Icons.LogoDungeon] as const;
const ROTATION_INTERVAL = 5000;

const RotatingLogo = () => {
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLogoIndex((index) => (index + 1) % LOGOS.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, []);

  const Logo = LOGOS[logoIndex];

  return (
    <IconSwap initial={false} mode="wait">
      <IconSwapItem
        key={logoIndex}
        as={motion.span}
        aria-hidden="true"
        className="inline-flex size-5 items-center justify-center overflow-visible"
      >
        <Logo className="size-7" />
      </IconSwapItem>
    </IconSwap>
  );
};

export default RotatingLogo;
