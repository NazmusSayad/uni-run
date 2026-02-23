import path from 'path'
import { getTempOutputFilePath } from '../../helpers/lib'
import { readUserConfig } from '../user-config'
import { ScriptRuntime } from './interface'

export const defaultRuntimes: ScriptRuntime[] = [
  {
    name: 'JavaScript',
    extensions: ['js', 'jsx', 'mjs', 'cjs', 'cjsx', 'mjsx'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.runtime?.javascript ?? 'node', ...args],
      }
    },
  },

  {
    name: 'TypeScript',
    extensions: ['ts', 'tsx', 'mts', 'cts', 'mtsx', 'ctsx'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.runtime?.typescript ?? 'tsx', ...args],
      }
    },
  },

  {
    name: 'Python',
    extensions: ['py'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()
      const runtime = userConfig.runtime?.python ?? 'python'

      return {
        start:
          runtime === 'uv'
            ? ['uv', 'run', 'python', ...args]
            : [runtime, ...args],
      }
    },
  },

  {
    name: 'Java',
    extensions: ['java'],
    async parse(args: string[]) {
      return {
        start: ['java', ...args],
      }
    },
  },

  {
    name: 'Dart',
    extensions: ['dart'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()
      const runtime = userConfig.runtime?.dart ?? 'dart'

      return {
        start:
          runtime === 'dart' ? ['dart', 'run', ...args] : [runtime, ...args],
      }
    },
  },

  {
    name: 'Powershell',
    extensions: ['ps1'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [
          userConfig.runtime?.powershell ?? 'powershell',
          '-File',
          ...args,
        ],
      }
    },
  },

  {
    name: 'Command Prompt',
    extensions: ['cmd', 'bat'],
    async parse(args: string[]) {
      return {
        start: ['cmd', '/c', ...args],
      }
    },
  },

  {
    name: 'Shell Script',
    extensions: ['sh'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.runtime?.shell ?? 'bash', ...args],
      }
    },
  },

  {
    name: 'Fish Shell Script',
    extensions: ['fish'],
    async parse(args: string[]) {
      return {
        start: ['fish', ...args],
      }
    },
  },

  {
    name: 'Lua',
    extensions: ['lua'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()

      return {
        start: [userConfig.runtime?.lua ?? 'lua', ...args],
      }
    },
  },

  {
    name: 'Ruby',
    extensions: ['rb'],
    async parse(args: string[]) {
      return {
        start: ['ruby', ...args],
      }
    },
  },

  {
    name: 'Go',
    extensions: ['go'],
    async parse(args: string[]) {
      return {
        start: ['go', 'run', ...args],
      }
    },
  },

  {
    name: 'C - GCC',
    extensions: ['c'],
    async parse([script, ...args]: string[]) {
      const output = getTempOutputFilePath('c-gcc')
      return {
        compile: ['gcc', script, '-o', output],
        start: [output, ...args],
      }
    },
  },

  {
    name: 'C++ - GCC',
    extensions: ['cpp'],
    async parse([script, ...args]: string[]) {
      const output = getTempOutputFilePath('cpp-gcc')
      return {
        compile: ['g++', script, '-o', output],
        start: [output, ...args],
      }
    },
  },

  {
    name: 'C# - Mono (Windows)',
    extensions: ['cs'],
    async parse([script, ...args]: string[]) {
      const output = getTempOutputFilePath('cs-mono')
      return {
        compile: ['mcs', '-out:' + output, script],
        start: [output, ...args],
      }
    },
  },

  {
    name: 'Rust - rustc',
    extensions: ['rs'],
    async parse([script, ...args]: string[]) {
      const output = getTempOutputFilePath('rust-rustc')
      return {
        compile: ['rustc', script, '-o', output],
        start: [output, ...args],
      }
    },
  },

  {
    name: 'SASS (CSS)',
    extensions: ['sass', 'scss'],
    async parse(args: string[]) {
      return {
        start: ['sass', ...args],
      }
    },
  },

  {
    name: 'PHP',
    extensions: ['php'],
    async parse(args: string[]) {
      return {
        start: ['php', ...args],
      }
    },
  },

  {
    name: 'HTML Server',
    extensions: ['html', 'htm'],
    async parse([script, ...args]: string[]) {
      return {
        extensions: ['html', 'css', 'js'],
        start: ['live-server', path.dirname(script), ...args],
      }
    },
  },
]
