import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';


/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: 'src/index.ts',
    output: [
        {
            file: 'lib/esm/aadhar.js',
            format: 'esm',
        },
        {
            file: 'lib/cjs/aadhar.js',
            format: 'cjs',
        },
        {
            file: 'lib/aadhar.min.js',
            format: 'umd',
            esModule: false,
            name: "AadharJS"
        }
    ],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        terser()
    ]
}

export default config;