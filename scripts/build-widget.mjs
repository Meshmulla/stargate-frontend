import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

const src = readFileSync('widget/stargate-widget.js', 'utf8');
// Minimal minification: strip comments and collapse whitespace
const minified = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/[^\n]*/g, '')
  .replace(/\s{2,}/g, ' ')
  .replace(/\n/g, '')
  .trim();

writeFileSync('dist/stargate-widget.js', minified);
console.log('dist/stargate-widget.js written (' + minified.length + ' bytes)');
