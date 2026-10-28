"use client";

import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

import { IconSwap, IconSwapItem } from "@/components/icon-swap";
import { Button } from "@/components/ui/button";
import type { CopyState } from "@/hooks/use-copy-to-clipboard";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export interface CopyStateIconProps {
  state: CopyState;
  idleIcon?: React.ReactNode;
  doneIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
}

const CopyStateIcon = ({
  state,
  idleIcon,
  doneIcon,
  errorIcon,
}: CopyStateIconProps) => (
  <IconSwap>
    <IconSwapItem key={state} as={motion.span}>
      {state === "idle" && (idleIcon ?? <CopyIcon data-slot="idle-icon" />)}

      {state === "done" && (doneIcon ?? <CheckIcon data-slot="done-icon" />)}

      {state === "error" &&
        (errorIcon ?? <CircleXIcon data-slot="error-icon" />)}
    </IconSwapItem>
  </IconSwap>
);

export type CopyButtonProps = ComponentProps<typeof Button> & {
  text: string | (() => string);
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
} & Omit<CopyStateIconProps, "state">;

const CopyButton = ({
  className,
  size = "icon",
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) => {
  const { state, copy } = useCopyToClipboard({
    onCopyError,
    onCopySuccess,
  });

  return (
    <Button
      variant="ghost"
      className={cn("will-change-transform", className)}
      size={size}
      onClick={(e) => {
        copy(text);
        onClick?.(e);
      }}
      aria-label="Copy"
      {...props}
    >
      <CopyStateIcon
        state={state}
        idleIcon={idleIcon}
        doneIcon={doneIcon}
        errorIcon={errorIcon}
      />
      {children}
    </Button>
  );
};

export default CopyButton;
