import { readUserConfig } from '../user-config'
import { ScriptRuntime } from './interface'

export const defaultRuntimes: ScriptRuntime[] = [
  {
    name: 'JavaScript',
    extensions: ['js', 'jsx', 'mjs', 'cjs', 'cjsx', 'mjsx'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.config?.jsRuntime ?? 'node', ...args],
      }
    },
  },

  {
    name: 'TypeScript',
    extensions: ['ts', 'tsx', 'mts', 'cts', 'mtsx', 'ctsx'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.config?.tsRuntime ?? 'tsx', ...args],
      }
    },
  },
]
