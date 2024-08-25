const fs = require('fs')
const path = require('path')
const { sync } = require('cross-spawn')
console.clear()

const outDir = path.resolve(__dirname, './dist')

if (fs.existsSync(outDir)) {
  console.log('Removing dist folder...')
  fs.rmSync(outDir, { force: true, recursive: true })
}

console.log('Starting build with tsc...')
sync('tsc', [], { stdio: 'inherit' })
