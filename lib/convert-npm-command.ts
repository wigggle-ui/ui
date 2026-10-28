export interface ConvertNpmCommandResult {
  pnpm: string;
  yarn: string;
  npm: string;
  bun: string;
}

const convertNpmCommand = (npmCommand: string): ConvertNpmCommandResult => {
  if (npmCommand.startsWith("npm install")) {
    return {
      bun: npmCommand.replaceAll("npm install", "bun add"),
      npm: npmCommand,
      pnpm: npmCommand.replaceAll("npm install", "pnpm add"),
      yarn: npmCommand.replaceAll("npm install", "yarn add"),
    };
  }

  if (npmCommand.startsWith("npx create-")) {
    return {
      bun: npmCommand.replace("npx", "bunx --bun"),
      npm: npmCommand,
      pnpm: npmCommand.replace("npx create-", "pnpm create "),
      yarn: npmCommand.replace("npx create-", "yarn create "),
    };
  }

  if (npmCommand.startsWith("npm create")) {
    return {
      bun: npmCommand.replace("npm create", "bun create"),
      npm: npmCommand,
      pnpm: npmCommand.replace("npm create", "pnpm create"),
      yarn: npmCommand.replace("npm create", "yarn create"),
    };
  }

  if (npmCommand.startsWith("npx")) {
    return {
      bun: npmCommand.replace("npx", "bunx --bun"),
      npm: npmCommand,
      pnpm: npmCommand.replace("npx", "pnpm dlx"),
      yarn: npmCommand.replace("npx", "yarn dlx"),
    };
  }

  if (npmCommand.startsWith("npm run")) {
    return {
      bun: npmCommand.replace("npm run", "bun"),
      npm: npmCommand,
      pnpm: npmCommand.replace("npm run", "pnpm"),
      yarn: npmCommand.replace("npm run", "yarn"),
    };
  }

  return {
    bun: npmCommand,
    npm: npmCommand,
    pnpm: npmCommand,
    yarn: npmCommand,
  };
};

export default convertNpmCommand;
