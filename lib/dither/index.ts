export {
  BAYER_2,
  BAYER_4,
  BAYER_8,
  BLUE_NOISE_64,
  DITHER_MATRICES,
  getThresholdMap,
  isInked,
  thresholdAt,
} from "@/lib/dither/matrices";
export type { DitherMatrix, ThresholdMap } from "@/lib/dither/matrices";

export {
  cssColor,
  DEFAULT_PALETTE,
  DITHER_COLOR_NAMES,
  DITHER_COLORS,
  MOTION,
} from "@/lib/dither/tokens";
export type {
  DitherColor,
  DitherColorName,
  DitherPalette,
  Rgba,
} from "@/lib/dither/tokens";

export {
  BLOOM_LEVELS,
  BLOOMS,
  bloomFilter,
  bloomLayerStyle,
  bloomStyle,
  ditherRamp,
  FILL_VARIANTS,
  fillStyle,
  fillTile,
  SERIES_COLORS,
  seriesColor,
} from "@/lib/dither/style";
export type {
  Bloom,
  FillEdge,
  FillStyleOptions,
  FillTile,
  FillVariant,
  RampOptions,
  RampTile,
} from "@/lib/dither/style";

export {
  readDitherCell,
  resolveColor,
  subscribeToTheme,
  useDitherColors,
} from "@/lib/dither/color";

export {
  useDocumentVisible,
  useFrameLoop,
  useInView,
  usePrefersReducedMotion,
} from "@/lib/dither/motion";
export type {
  FrameLoopCallback,
  FrameLoopOptions,
  FrameLoopState,
} from "@/lib/dither/motion";

export { DitherShader, MAX_LIVE_CONTEXTS } from "@/lib/dither/shader";
export type {
  DitherShaderProps,
  DitherShaderState,
  DitherUniforms,
  ShaderUniformValue,
} from "@/lib/dither/shader";

export { BloomBox, BloomGroup, FillPattern } from "@/lib/dither/fill";
export type {
  BloomBoxProps,
  BloomGroupProps,
  FillPatternProps,
  FillRamp,
} from "@/lib/dither/fill";

export {
  DitherPattern,
  ditherMask,
  ditherMaskStyle,
  ditherPath,
} from "@/lib/dither/pattern";
export type {
  DitherMaskOptions,
  DitherMaskStyleOptions,
  DitherPatternProps,
} from "@/lib/dither/pattern";

export { DITHER_METHODS, ditherImage } from "@/lib/dither/diffuse";
export type {
  DiffuseOptions,
  DiffusionMethod,
  DiffusionOptions,
  DitherMethod,
  ImagePalette,
  OrderedMethod,
  OrderedOptions,
  PaletteColor,
  PixelBuffer,
} from "@/lib/dither/diffuse";
