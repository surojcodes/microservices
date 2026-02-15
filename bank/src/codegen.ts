import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schemas/**/*.graphql",
  documents: [],
  generates: {
    "src/generated/generated-types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};
export default config;
