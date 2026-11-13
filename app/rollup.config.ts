import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/eid-app.ts',
    output: {
        file: 'dist/eid-app.js',
        format: 'es'
    },
    external: ['os', 'std'],
    plugins: [
        commonjs(),
        nodeResolve({
            extensions: ['.ts', '.js']
        }),
        typescript({
            tsconfig: './tsconfig.json'
        })
    ]
};
