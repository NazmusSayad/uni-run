import { defineConfig } from 'tsdown'
import packageJSON from './package.json' with { type: 'json' }

export default defineConfig({
  entry: {
    run: './src/run.ts',
    rux: './src/rux.ts',
  },

  format: 'es',
  outDir: './dist',
  tsconfig: './tsconfig.json',

  target: 'ES6',
  minify: 'dce-only',

  treeshake: false,
  external: [/node:/gim, ...getExternal((packageJSON as any).dependencies)],

  outputOptions(options, format) {
    const ext = format === 'cjs' ? 'cjs' : format === 'es' ? 'mjs' : 'js'

    return {
      ...options,
      entryFileNames: `[name].${ext}`,
    }
  },
})

function getExternal(dependencies: unknown) {
  return Object.keys((dependencies ?? {}) as Record<string, string>).map(
    (dep) => new RegExp(`(^${dep}$)|(^${dep}/)`)
  )
}
