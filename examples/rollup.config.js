// cli: rollup -c -w -m inline entryFile
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
	format: 'iife',
	dest: 'index.js',
	plugins: [
		serve({open: true, contentBase: ''}), //{open: true, contentBase: ['dist', 'html']}
		livereload('') //'dist'
	]
}
