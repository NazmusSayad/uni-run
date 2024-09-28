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
        run: [runtime, ...args],
        isInstalled: [runtime, '--version'],
        installHints,
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
        run: [runtime, ...args],
        isInstalled: [runtime, '--version'],
        installHints,
        watchExts: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
      }
    },
  },

  {
    name: 'Python',
    exts: ['py'],
    getRuntime(args, options, config) {
      return {
        run: ['python', ...args],
        isInstalled: ['python', '--version'],
        installHints: ['Please install Python from https://www.python.org'],
      }
    },
  },

  {
    name: 'Java',
    exts: ['java'],
    getRuntime(args, options, config) {
      return {
        run: ['java', ...args],
        isInstalled: ['java', '--version'],
        installHints: ['Please install Java from https://www.oracle.com/java'],
      }
    },
  },

  {
    name: 'Powershell',
    exts: ['ps1'],
    getRuntime(args, options, config) {
      return {
        run: ['powershell', '-File', ...args],
        isInstalled: ['powershell', '-command', 'echo ok'],
        installHints: [
          'Please install Powershell from https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell',
        ],
      }
    },
  },

  {
    name: 'Command Prompt',
    exts: ['cmd', 'bat'],
    getRuntime(args, options, config) {
      return {
        run: ['cmd', '/c', ...args],
        isInstalled: ['cmd', '/c', 'echo ok'],
        installHints: ['Please install Command Prompt from Windows'],
      }
    },
  },

  {
    name: 'Shell Script',
    exts: ['sh'],
    getRuntime(args, options, config) {
      return {
        run: ['bash', ...args],
        isInstalled: ['bash', '--version'],
        installHints: [
          'Please install Bash from https://www.gnu.org/software/bash',
        ],
      }
    },
  },

  {
    name: 'Fish Shell Script',
    exts: ['fish'],
    getRuntime(args, options, config) {
      return {
        run: ['fish', ...args],
        isInstalled: ['fish', '--version'],
        installHints: ['Please install Fish from https://fishshell.com'],
      }
    },
  },

  {
    name: 'Lua',
    exts: ['lua'],
    getRuntime(args, options, config) {
      return {
        run: ['lua', ...args],
        isInstalled: ['lua', '-v'],
        installHints: ['Please install Lua from https://www.lua.org'],
      }
    },
  },

  {
    name: 'SASS (CSS)',
    exts: ['sass', 'scss'],
    getRuntime(args, options, config) {
      return {
        run: ['sass', ...args],
        isInstalled: ['sass', '--version'],
        installHints: ['Please install SASS from https://sass-lang.com'],
      }
    },
  },

  {
    name: 'HTML Server',
    exts: ['html', 'htm'],
    getRuntime(args, options, config) {
      return {
        run: ['http-server', ...args],
        isInstalled: ['http-server', '--version'],
        installHints: [
          'Please install http-server from https://www.npmjs.com/package/http-server',
        ],

        watchExts: ['css', 'js', 'javascript', 'json'],
      }
    },
  },
])
