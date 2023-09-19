import rollupTypescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";
import commonjs from "rollup-plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "typescript";

export default {
  input: "./src/index.ts",
  plugins: [
    clear({ targets: ["bin"] }),
    rollupTypescript({
      include: "src/**/*.ts",
      exclude: "node_modules/**",
      typescript: typescript,
    }),
    commonjs(),
    terser(),
  ],
  output: [
    {
      format: "esm",
      file: "bin/main.esm.js",
      banner: "#!/usr/bin/env node",
    },
  ],
};
