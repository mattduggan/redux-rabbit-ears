import babel  from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const input = 'src/index.js';
const external = ['window'];
const globals = { window: 'window' };
const plugins = [
    nodeResolve({
        jsnext: true
    }),
    babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers'],
    }),
    uglify({
        compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false
        }
    })
];

export default [
    {
        input,
        external,
        plugins,
        output: [
            {
                format: 'cjs',
                file: 'lib/redux-rabbit-ears.js',
                indent: false,
                globals
            },
            {
                format: 'umd',
                file: 'dist/redux-rabbit-ears.js',
                name: 'ReduxRabbitEars',
                indent: false,
                globals
            },
            {
                format: 'iife',
                file: 'example/redux-rabbit-ears.js',
                name: 'ReduxRabbitEars',
                indent: false,
                globals
            }
        ]
    }
];
