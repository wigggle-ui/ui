const COMMENTS = /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/gu;
const DIRECTIVE = /^[ \t]*#/mu;
const STRUCT = /^\s*(?:(?:lowp|mediump|highp|const|uniform)\s+)*struct\b/u;
const PRECISION = /^\s*precision\b/u;
// GLSL tokens: numbers (with any exponent), names, the two-character
// operators, then any other single character, `.` included. So `p.x` and
// `p . x` match, while `a + ++b` and `a++ +b` stay different.
const TOKEN =
  /\d+\.\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?|\d+(?:[eE][-+]?\d+)?|[A-Za-z_]\w*|\+\+|--|<=|>=|==|!=|&&|\|\||\^\^|[-+*/]=|\S/gu;

/**
 * GLSL without directives, split at the top level with comments dropped:
 * declarations ending in `;` and definitions ending in their `}`.
 */
const topLevelChunks = (source: string): string[] => {
  const code = source.replaceAll(COMMENTS, " ");
  const chunks: string[] = [];
  let depth = 0;
  let start = 0;
  const cut = (end: number) => {
    const chunk = code.slice(start, end).trim();
    start = end;
    if (chunk !== "") {
      chunks.push(chunk);
    }
  };
  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      // A struct declaration runs on to its `;`, which may name variables.
      if (depth === 0 && !STRUCT.test(code.slice(start, index))) {
        cut(index + 1);
      }
    } else if (char === ";" && depth === 0) {
      cut(index + 1);
    }
  }
  cut(code.length);
  return chunks;
};

const tokens = (chunk: string) => chunk.match(TOKEN)?.join(" ") ?? "";

const hasDirective = (source: string) =>
  DIRECTIVE.test(source.replaceAll(COMMENTS, " "));

/**
 * `field` and `colorField` compile into one shader, where defining a helper
 * twice is an error. A common way to share one is to prepend the same
 * string to both, so drop any definition from `colorField` that `field`
 * already has, token for token. Two different definitions still fail.
 * Sources with preprocessor directives are left alone: a definition's
 * meaning can depend on `#if` and `#define` around it. `precision`
 * statements are always kept, since each sets the precision for the code
 * after it.
 */
export const withoutSharedHelpers = (
  field: string,
  colorField: string
): string => {
  if (hasDirective(field) || hasDirective(colorField)) {
    return colorField;
  }
  const defined = new Set(topLevelChunks(field).map(tokens));
  return topLevelChunks(colorField)
    .filter((chunk) => PRECISION.test(chunk) || !defined.has(tokens(chunk)))
    .join("\n");
};
