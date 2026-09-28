import { readFileSync } from 'node:fs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const banner = `/*! ${packageJson.name} v${packageJson.version} | ${packageJson.license} */`;

const output = (file, {
  format = 'umd',
  legacy = false,
  minify = false
} = {}) => {
  const configuration = {
    file,
    format,
    banner,
    generatedCode: legacy ? 'es5' : 'es2015',
    plugins: minify
      ? [terser({
          ecma: legacy ? 5 : 2020,
          compress: true,
          mangle: true,
          format: { comments: /^!/ }
        })]
      : []
  };

  if (format === 'umd') {
    configuration.name = 'Tokenary';
    configuration.exports = 'default';
  }

  return configuration;
};

export default [
  {
    input: 'src/index.js',
    plugins: [commonjs()],
    output: [
      output('dist/tokenary.js'),
      output('dist/tokenary.min.js', { minify: true })
    ]
  },
  {
    input: 'src/index.mjs',
    plugins: [commonjs()],
    output: [
      output('dist/tokenary.esm.js', { format: 'es' })
    ]
  },
  {
    input: 'src/index.js',
    plugins: [
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        babelrc: false,
        configFile: false,
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            bugfixes: true,
            modules: false,
            targets: { ie: '11' }
          }]
        ]
      })
    ],
    output: [
      output('dist/tokenary.legacy.js', { legacy: true }),
      output('dist/tokenary.legacy.min.js', { legacy: true, minify: true })
    ]
  }
];
