import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/*
 * Module boundaries (keeps features independent as the app grows):
 *   app/       → may import shared/ and a feature's public index ("@/features/x")
 *   features/  → may import shared/ only; never another feature
 *   shared/    → may never import features
 */
const deepFeatureImport = {
  group: ["@/features/*/*"],
  message: 'Import a feature through its public API ("@/features/<name>"), not its internals.',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [deepFeatureImport] }] },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "../../*"],
              message:
                "Features must not depend on other features. Move shared code to src/shared.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/features/**"], message: "Shared code must not depend on features." },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
