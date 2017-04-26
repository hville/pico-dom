'use strict';

const fs = require('fs');
const path = require('path');
const compile = require('google-closure-compiler-js').compile;

const infiles = ['./dist/browser.js']

const sources = [];
infiles.forEach(path => {
  readFile(path, src => {
    sources.push(src);
    if (sources.length === infiles.length) {
      ready();
    }
  })
});

function readFile(path, cb) {
  if (path === '-') {
    let src = '';
    process.stdin.resume();
    process.stdin.on('data', buf => src += buf.toString());
    process.stdin.on('end', () => cb(src));
  } else {
    fs.readFile(path, 'utf8', (err, src) => err ? error(err) : cb({src, path}));
  }
}

function ready() {
  const flags = {jsCode: sources};
  const out = compile(flags);
  console.log(out.compiledCode);
}

function error(err) {
  console.error(err);
  process.exit(1);
}
/*



const compile = require('google-closure-compiler-js').compile;

const flags = {
  jsCode: [{src: 'const x = 1 + 2;'}],
};
const out = compile(flags);
console.info(out.compiledCode);  // will print 'var x = 3;\n'
*/
