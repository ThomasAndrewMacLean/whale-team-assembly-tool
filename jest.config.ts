import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/**",
    "!src/store/StoreProvider.tsx",
    "!src/store/hooks.ts",
    "!src/store/store.ts",
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(config);
