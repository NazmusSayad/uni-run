// @ts-nocheck

let currentModule: 'cjs' | 'mjs'

try {
  currentModule = module
  currentModule = exports
  currentModule = 'cjs'
} catch {
  currentModule = 'mjs'
}

if (!currentModule) {
  throw new Error('Unkown module System')
}

export default {
  isCJS: currentModule === 'cjs',
  isESM: currentModule === 'mjs',
}
