"use client";

import { useTiks } from "@rexa-developer/tiks/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWebHaptics } from "web-haptics/react";

export type CopyState = "idle" | "done" | "error";

export interface UseCopyToClipboardOptions {
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  resetDelay?: number;
}

export const useCopyToClipboard = ({
  onCopySuccess,
  onCopyError,
  resetDelay = 1500,
}: UseCopyToClipboardOptions = {}) => {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetDelayRef = useRef(resetDelay);

  const { trigger: haptic } = useWebHaptics();
  const { success: tiksSuccess, error: tiksError } = useTiks();

  useEffect(() => {
    resetDelayRef.current = resetDelay;
  }, [resetDelay]);

  const copy = useCallback(
    async (text: string | (() => string)) => {
      // Clear any pending reset
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      try {
        const finalText = typeof text === "function" ? text() : text;
        await navigator.clipboard.writeText(finalText);

        setState("done");

        haptic("success");
        tiksSuccess();

        onCopySuccess?.(finalText);
      } catch (error) {
        setState("error");

        haptic("error");
        tiksError();

        onCopyError?.(
          error instanceof Error ? error : new Error("Copy failed")
        );
      }

      resetTimeoutRef.current = setTimeout(() => {
        setState("idle");
      }, resetDelayRef.current);
    },
    [onCopySuccess, onCopyError, haptic, tiksSuccess, tiksError]
  );

  return { copy, state } as const;
};
