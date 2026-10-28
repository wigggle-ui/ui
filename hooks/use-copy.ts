import { useState } from "react";

const useCopy = (duration = 1500) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
      return true;
    } catch (error) {
      console.error("Failed to copy text:", error);
      return false;
    }
  };

  return {
    copied,
    copy,
  };
};

export default useCopy;
