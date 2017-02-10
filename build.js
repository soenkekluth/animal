import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import { minify } from 'uglify-js';
import fs from 'fs';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);
external.push('dom-helpers/util/requestAnimationFrame');


rollup({
  entry: pkg.src,
  external,
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: [
        'node_modules/**',
      ],
    }),
  ],
})
  .then(bundle => bundle.write({
    dest: pkg.module,
    format: 'es',
  })).catch(err => console.log(err.stack));


rollup({
  entry: pkg.src,
  external,
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel(babelrc()),
    commonjs({
      include: [
        'node_modules/**',
      ],
    }),
  ],
})
  .then(bundle => bundle.write({
    dest: pkg.main,
    format: 'cjs',
  })).catch(err => console.log(err.stack));


rollup({
  entry: pkg.src,
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
    }),
    babel(babelrc()),
    commonjs({
      // include: 'node_modules/**',
    }),

  ],
})
.then((bundle) => {
  const dest = pkg.dist;
  bundle.write({
    moduleName: 'animal',
    exports: 'named',
    format: 'iife',
    dest,
  })
    .then(() => {
      const code = minify(dest, {
        mangle: { except: ['animal'] },
      }).code;

      fs.writeFileSync(dest.replace('.js', '.min.js'), code);
      return bundle;
    });
})
.catch(err => console.log(err.stack));
