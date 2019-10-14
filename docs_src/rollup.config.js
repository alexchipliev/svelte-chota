import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import svgicons from 'rollup-plugin-svg-icons'
import {markdown} from 'svelte-preprocess-markdown'
import {renderer,highlight,bugremover} from './utils'

const production = !process.env.ROLLUP_WATCH;






export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: './public/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			/*css: css => {
				css.write('public/bundle.css',!production);
			},*/
			emitCss:true,
			extensions: ['.svelte','.md'],
			preprocess: markdown({
				renderer:renderer(),
				highlight,
				langPrefix:'hljs language-'
			})
		}),
		svgicons({
			inputFolder: './src/icons_for_sprite',
			output: './public/icons/sprite.svg'
		}),
		postcss({
			extract: true,
			minimize: production,
			sourceMap: !production
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		// Good idea to add idents to the <pre><code> block?!
		production && bugremover(),
	],
	watch: {
		clearScreen: false
	}
};


