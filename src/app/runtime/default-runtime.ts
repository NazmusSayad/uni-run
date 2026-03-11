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
      const runtime = userConfig.runtime?.javascript ?? 'node'

      if (runtime === 'node') {
        return {
          start: ['node', ...args],
        }
      }

      if (runtime === 'bun') {
        return {
          start: ['bun', 'run', ...args],
        }
      }

      if (runtime === 'deno') {
        return {
          start: ['deno', 'run', ...args],
        }
      }

      throw new Error(`Unsupported JavaScript runtime: ${runtime}`)
    },
  },

  {
    name: 'TypeScript',
    extensions: ['ts', 'tsx', 'mts', 'cts', 'mtsx', 'ctsx'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()
      const runtime = userConfig.runtime?.typescript ?? 'tsx'

      if (runtime === 'tsx') {
        return {
          start: ['tsx', ...args],
        }
      }

      if (runtime === 'ts-node') {
        return {
          start: ['ts-node', ...args],
        }
      }

      if (runtime === 'bun') {
        return {
          start: ['bun', 'run', ...args],
        }
      }

      if (runtime === 'deno') {
        return {
          start: ['deno', 'run', ...args],
        }
      }

      throw new Error(`Unsupported TypeScript runtime: ${runtime}`)
    },
  },

  {
    name: 'Python',
    extensions: ['py'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()
      const runtime = userConfig.runtime?.python ?? 'python'

      if (runtime === 'python' || runtime === 'python3') {
        return {
          start: [runtime, ...args],
        }
      }

      if (runtime === 'uv') {
        return {
          start: ['uv', 'run', 'python', ...args],
        }
      }

      throw new Error(`Unsupported Python runtime: ${runtime}`)
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

      if (runtime === 'fvm') {
        return {
          start: ['fvm', 'dart', 'run', ...args],
        }
      }

      if (runtime === 'dart') {
        return {
          start: ['dart', 'run', ...args],
        }
      }

      if (runtime === 'dartvm') {
        return {
          start: ['dartvm', ...args],
        }
      }

      throw new Error(`Unsupported Dart runtime: ${runtime}`)
    },
  },

  {
    name: 'Powershell',
    extensions: ['ps1'],
    async parse(args: string[]) {
      const userConfig = readUserConfig()
      const runtime = userConfig.runtime?.powershell ?? 'powershell'

      if (runtime === 'powershell' || runtime === 'pwsh') {
        return {
          start: [runtime, '-File', ...args],
        }
      }

      throw new Error(`Unsupported PowerShell runtime: ${runtime}`)
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
      const shell = userConfig.runtime?.shell ?? 'bash'

      if (shell === 'bash' || shell === 'zsh' || shell === 'sh') {
        return {
          start: [shell, ...args],
        }
      }

      throw new Error(`Unsupported shell: ${shell}`)
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
      const runtime = userConfig.runtime?.lua ?? 'lua'

      if (runtime === 'lua') {
        return {
          start: ['lua', ...args],
        }
      }

      if (runtime === 'luajit') {
        return {
          start: ['luajit', ...args],
        }
      }

      if (runtime === 'luac') {
        return {
          start: ['luac', ...args],
        }
      }

      throw new Error(`Unsupported Lua runtime: ${runtime}`)
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
