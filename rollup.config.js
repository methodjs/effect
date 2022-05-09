const external = ['react'];

const plugins = [];

const DefaultConfig = [
  // CommonJs
  {
    input: 'js/index.js',
    output: {
      file: 'lib/effect.js',
      format: 'cjs',
      exports: 'named',
    },
    external,
    plugins,
  },
  // ES
  {
    input: 'js/index.js',
    output: {
      file: 'es/effect.js',
      format: 'es',
      exports: 'named',
    },
    external,
    plugins,
  },
  // ES for browsers
  {
    input: 'js/index.js',
    output: {
      file: 'es/effect.mjs',
      format: 'es',
      exports: 'named',
    },
    external,
    plugins,
  },
  // UMD
  {
    input: 'js/index.js',
    output: {
      file: 'dist/effect.js',
      format: 'umd',
      name: 'Effect',
      exports: 'named',
      globals: {
        react: 'React',
      },
    },
    external,
    plugins,
  },
];

export default DefaultConfig;
