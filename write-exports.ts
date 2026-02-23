import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { Options } from 'tsdown'
import packageJSON from './package.json' with { type: 'json' }
import _tsDownConfig from './tsdown.config.ts'

const tsDownConfig = _tsDownConfig as Options
const outDir = tsDownConfig.outDir ?? './dist'
const pkgJSON = structuredClone(packageJSON) as any

pkgJSON.exports = {}
pkgJSON.typesVersions = {}

Object.keys(tsDownConfig.entry ?? {}).forEach((key) => {
  if (key === 'index') {
    pkgJSON.main = `${outDir}/${key}.cjs`
    pkgJSON.module = `${outDir}/${key}.mjs`
  }

  pkgJSON.exports[key === 'index' ? '.' : `./${key}`] = {
    import: `${outDir}/${key}.mjs`,
    require: `${outDir}/${key}.cjs`,
  }

  pkgJSON.typesVersions['*'] ??= {}
  pkgJSON.typesVersions['*'][key === 'index' ? '.' : key] = [
    `${outDir}/${key}.d.mts`,
    `${outDir}/${key}.d.cts`,
  ]
})

console.log('📢 Writing package.json...')
fs.writeFileSync('./package.json', JSON.stringify(pkgJSON, null, 2))

console.log('✨ Running prettier...')
spawnSync('npx', ['prettier', '--write', './package.json'])

console.log('✅ Done')
