import { type InternalModuleFormat } from 'rolldown'
import { defineConfig } from 'tsdown'
import packageJSON from './package.json' with { type: 'json' }

export default defineConfig({
  entry: {
    run: './src/run.ts',
    rux: './src/rux.ts',
  },

  outDir: './dist',
  tsconfig: './tsconfig.json',
  format: ['cjs', 'es'] satisfies InternalModuleFormat[],

  dts: true,
  sourcemap: true,

  target: 'ES6',
  minify: 'dce-only',

  external: [
    /node:/gim,
    ...getExternal((packageJSON as any).dependencies),
    // ...getExternal((packageJSON as any).devDependencies),
    // ...getExternal((packageJSON as any).peerDependencies),
  ],

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
