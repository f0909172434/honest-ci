import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json-summary"],
    },
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
