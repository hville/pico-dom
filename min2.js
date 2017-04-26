'use strict';

const compile = require('google-closure-compiler-js').compile;
const fs = require('fs')

var src = fs.readFileSync('./dist/browser.js', 'utf8')
//console.log(src)


const flags = {
  jsCode: [{src: src}],
  warningLevel: 'VERBOSE',
};
const out = compile(flags);
console.log(out)
console.log(out.compiledCode)
console.log(out.compiledCode)

if (out.warnings.length || out.errors.length) {
  console.error(`expected zero warnings/errors, got: ${out.warnings} ${out.errors}`);
  throw new Error('test failed');
}

console.info('Ok! 👍')
