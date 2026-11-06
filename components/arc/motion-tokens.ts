export const motionTokens = {
  /** Blur radii in px for text and content crossfades. Keep blur small and brief. */
  blur: { soft: 4, subtle: 2, text: 8 },
  duration: {
    considered: 0.48,
    exit: 0.18,
    fast: 0.16,
    instant: 0.12,
    standard: 0.24,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    /** For elements that move while already on screen. */
    inOut: [0.65, 0, 0.35, 1],
    standard: [0.22, 1, 0.36, 1],
  },
  spring: {
    gentle: { damping: 34, stiffness: 340, type: "spring" },
    /** Shape morphs, shared layout highlights, and width changes that follow new content. No bounce: sizes and positions settle without overshoot. */
    morph: { bounce: 0, type: "spring", visualDuration: 0.42 },
    responsive: { damping: 44, stiffness: 520, type: "spring" },
    /** Panels, height changes, and layout shifts. Critically damped, never overshoots. */
    smooth: { bounce: 0, type: "spring", visualDuration: 0.4 },
    /** Presses, toggles, thumbs, and small indicators. Settles fast and never overshoots, so nothing jitters. */
    snappy: { bounce: 0, type: "spring", visualDuration: 0.26 },
  },
  /** Stagger steps in seconds. Keep total stagger under roughly 0.4s. */
  stagger: { char: 0.016, item: 0.035, line: 0.08, word: 0.04 },
} as const;
