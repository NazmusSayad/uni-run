import as from '../helpers/as'
import { ScriptExecutorOptions } from './types.t'

export default as<ScriptExecutorOptions[]>([
  {
    name: 'JavaScript',
    exts: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
    getRuntime(args, options, config) {
      let installHints: undefined | string[]
      const runtime = config['javascript-runtime'] || 'node'

      switch (runtime) {
        case 'node':
          installHints = ['Please install Node.js from https://nodejs.org']
          break

        case 'deno':
          installHints = ['Please install Deno from https://deno.land']
          break

        case 'bun':
          installHints = ['Please install Bun from https://bun.sh']
          break
      }

      return {
        start: [runtime, ...args],
        install: {
          check: [runtime, '--version'],
          hints: installHints,
        },
      }
    },
  },

  {
    name: 'TypeScript',
    exts: ['ts', 'tsx', 'cts', 'ctsx', 'mts', 'mtsx'],
    getRuntime(args, options, config) {
      let installHints: undefined | string[]
      const runtime = options.tsNode
        ? 'ts-node'
        : config['typescript-runtime'] || 'tsx'

      switch (runtime) {
        case 'tsx':
          installHints = ['Please install tsx from https://tsx.is']
          break

        case 'ts-node':
          installHints = [
            'Please install ts-node from https://www.npmjs.com/package/ts-node',
          ]
          break

        case 'deno':
          installHints = ['Please install Deno from https://deno.land']
          break

        case 'bun':
          installHints = ['Please install Bun from https://bun.sh']
          break
      }

      return {
        start: [runtime, ...args],
        watchExts: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
        install: {
          check: [runtime, '--version'],
          hints: installHints,
        },
      }
    },
  },

  {
    name: 'Python',
    exts: ['py'],
    getRuntime(args, options, config) {
      return {
        start: ['python', ...args],
        install: {
          check: ['python', '--version'],
          hints: ['Please install Python from https://www.python.org'],
        },
      }
    },
  },

  {
    name: 'Java',
    exts: ['java'],
    getRuntime(args, options, config) {
      return {
        start: ['java', ...args],
        install: {
          check: ['java', '--version'],
          hints: ['Please install Java from https://www.oracle.com/java'],
        },
      }
    },
  },

  {
    name: 'Powershell',
    exts: ['ps1'],
    getRuntime(args, options, config) {
      return {
        start: ['powershell', '-File', ...args],
        install: {
          check: ['powershell', '-command', 'echo ok'],
          hints: [
            'Please install Powershell from https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell',
          ],
        },
      }
    },
  },

  {
    name: 'Command Prompt',
    exts: ['cmd', 'bat'],
    getRuntime(args, options, config) {
      return {
        start: ['cmd', '/c', ...args],
        install: {
          check: ['cmd', '/c', 'echo ok'],
          hints: ['Please install Command Prompt from Windows'],
        },
      }
    },
  },

  {
    name: 'Shell Script',
    exts: ['sh'],
    getRuntime(args, options, config) {
      return {
        start: ['bash', ...args],
        install: {
          check: ['bash', '--version'],
          hints: ['Please install Bash from https://www.gnu.org/software/bash'],
        },
      }
    },
  },

  {
    name: 'Fish Shell Script',
    exts: ['fish'],
    getRuntime(args, options, config) {
      return {
        start: ['fish', ...args],
        install: {
          check: ['fish', '--version'],
          hints: ['Please install Fish from https://fishshell.com'],
        },
      }
    },
  },

  {
    name: 'Lua',
    exts: ['lua'],
    getRuntime(args, options, config) {
      return {
        start: ['lua', ...args],
        install: {
          check: ['lua', '-v'],
          hints: ['Please install Lua from https://www.lua.org'],
        },
      }
    },
  },

  {
    name: 'Ruby',
    exts: ['rb'],
    getRuntime(args, options, config) {
      return {
        start: ['ruby', ...args],
        install: {
          check: ['ruby', '-v'],
          hints: ['Please install Ruby from https://www.ruby-lang.org'],
        },
      }
    },
  },

  {
    name: 'Go',
    exts: ['go'],
    getRuntime(args, options, config) {
      return {
        start: ['go', 'run', ...args],
        install: {
          check: ['go', '-v'],
          hints: ['Please install Ruby from https://www.ruby-lang.org'],
        },
      }
    },
  },

  {
    name: 'SASS (CSS)',
    exts: ['sass', 'scss'],
    getRuntime(args, options, config) {
      return {
        start: ['sass', ...args],
        install: {
          check: ['sass', '--version'],
          hints: ['Please install SASS from https://sass-lang.com'],
        },
      }
    },
  },

  {
    name: 'HTML Server',
    exts: ['html', 'htm'],
    getRuntime(args, options, config) {
      return {
        start: ['http-server', ...args],
        watchExts: ['css', 'js', 'javascript', 'json'],
        install: {
          check: ['http-server', '--version'],
          hints: [
            'Please install http-server from https://www.npmjs.com/package/http-server',
          ],
        },
      }
    },
  },
])
