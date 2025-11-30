import path from 'path'
import as from '../helpers/as'
import os from '../helpers/os'
import { getUniqueCacheDir } from './helpers'
import { RuntimeOptions, ScriptExecutorOptions } from './types.t'

export default as<ScriptExecutorOptions[]>([
  {
    name: 'JavaScript',
    exts: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
    getRuntime(args, options, config) {
      const runtimeOptions: Partial<RuntimeOptions> = {}
      const runtime = config['javascript-runtime'] || 'node'

      switch (runtime) {
        case 'node':
          runtimeOptions.installHints = [
            'Please install Node.js from https://nodejs.org',
          ]
          break

        case 'deno':
          if (os.isWindows) {
            runtimeOptions.install = [
              'powershell',
              '-c',
              'irm https://deno.land/install.ps1 | iex',
            ]
          } else if (os.isUnix) {
            runtimeOptions.install = [
              'bash',
              '-c',
              'curl -fsSL https://deno.land/install.sh | bash',
            ]
          }

          runtimeOptions.installHints = [
            'Please install Deno from https://deno.land',
          ]
          break

        case 'bun':
          if (os.isWindows) {
            runtimeOptions.install = [
              'powershell',
              '-c',
              'irm bun.sh/install.ps1 | iex',
            ]
          } else if (os.isUnix) {
            runtimeOptions.install = [
              'bash',
              '-c',
              'curl -fsSL https://bun.sh/install | bash',
            ]
          }

          runtimeOptions.installHints = [
            'Please install Bun from https://bun.sh',
          ]
          break
      }

      return {
        ...runtimeOptions,
        exec: [runtime, ...args],
      }
    },
  },

  {
    name: 'TypeScript',
    exts: ['ts', 'tsx', 'cts', 'ctsx', 'mts', 'mtsx'],
    getRuntime(args, options, config) {
      const runtimeOptions: Partial<RuntimeOptions> = {}
      const runtime = config['typescript-runtime'] || 'tsx'

      switch (runtime) {
        case 'tsx':
          runtimeOptions.install = ['npm', 'install', '-g', 'tsx']
          runtimeOptions.installHints = [
            'Please install tsx from https://tsx.is',
          ]
          break

        case 'ts-node':
          runtimeOptions.install = ['npm', 'install', '-g', 'ts-node']
          runtimeOptions.installHints = [
            'Please install ts-node from https://www.npmjs.com/package/ts-node',
          ]

          break

        case 'deno':
          if (os.isWindows) {
            runtimeOptions.install = [
              'powershell',
              '-c',
              'irm https://deno.land/install.ps1 | iex',
            ]
          } else if (os.isUnix) {
            runtimeOptions.install = [
              'bash',
              '-c',
              'curl -fsSL https://deno.land/install.sh | bash',
            ]
          }

          runtimeOptions.installHints = [
            'Please install Deno from https://deno.land',
          ]
          break

        case 'bun':
          if (os.isWindows) {
            runtimeOptions.install = [
              'powershell',
              '-c',
              'irm bun.sh/install.ps1 | iex',
            ]
          } else if (os.isUnix) {
            runtimeOptions.install = [
              'bash',
              '-c',
              'curl -fsSL https://bun.sh/install | bash',
            ]
          }

          runtimeOptions.installHints = [
            'Please install Bun from https://bun.sh',
          ]
          break
      }

      return {
        ...runtimeOptions,
        exec: [runtime, ...args],
        watchExts: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
      }
    },
  },

  {
    name: 'Python',
    exts: ['py'],
    getRuntime(args, options, config) {
      return {
        exec: ['python', ...args],
        installHints: ['Please install Python from https://www.python.org'],
      }
    },
  },

  {
    name: 'Java',
    exts: ['java'],
    getRuntime(args, options, config) {
      return {
        exec: ['java', ...args],
        installHints: ['Please install Java from https://www.oracle.com/java'],
      }
    },
  },

  {
    name: 'Dart',
    exts: ['dart'],
    getRuntime(args, options, config) {
      return {
        exec: ['dartvm', ...args],
        installHints: ['Please install Dart from https://dart.dev'],
      }
    },
  },

  {
    name: 'Powershell',
    exts: ['ps1'],
    getRuntime(args, options, config) {
      return {
        exec: ['powershell', '-File', ...args],
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
        exec: ['cmd', '/c', ...args],
        installHints: ['Please install Command Prompt from Windows'],
      }
    },
  },

  {
    name: 'Shell Script',
    exts: ['sh'],
    getRuntime(args, options, config) {
      return {
        exec: ['bash', ...args],
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
        exec: ['fish', ...args],
        installHints: ['Please install Fish from https://fishshell.com'],
      }
    },
  },

  {
    name: 'Lua',
    exts: ['lua'],
    getRuntime(args, options, config) {
      return {
        exec: ['lua', ...args],
        installHints: ['Please install Lua from https://www.lua.org'],
      }
    },
  },

  {
    name: 'Ruby',
    exts: ['rb'],
    getRuntime(args, options, config) {
      return {
        exec: ['ruby', ...args],
        installHints: ['Please install Ruby from https://www.ruby-lang.org'],
      }
    },
  },

  {
    name: 'Go',
    exts: ['go'],
    getRuntime(args, options, config) {
      return {
        exec: ['go', 'run', ...args],
        installHints: ['Please install Ruby from https://www.ruby-lang.org'],
      }
    },
  },

  {
    name: 'C - GCC',
    exts: ['c'],
    getRuntime([script, ...args], options, config) {
      const output = getUniqueCacheDir('/c-gcc') + '/output'

      return {
        compile: ['gcc', script, '-o', output],
        exec: [output, ...args],
        installHints: ['Please install GCC from https://gcc.gnu.org'],
      }
    },
  },

  {
    name: 'C++ - GCC',
    exts: ['cpp'],
    getRuntime([script, ...args], options, config) {
      const output = getUniqueCacheDir('/cpp-gcc') + '/output'

      return {
        compile: ['g++', script, '-o', output],
        exec: [output, ...args],
        installHints: ['Please install GCC from https://gcc.gnu.org'],
      }
    },
  },

  {
    name: 'C# - Mono (Windows)',
    exts: ['cs'],
    getRuntime([script, ...args], options, config) {
      const output = getUniqueCacheDir('/cs-mono') + '/output.exe'

      return {
        compile: ['mcs', '-out:' + output, script],
        exec: [output, ...args],
        installHints: ['Please install Mono from https://www.mono-project.com'],
      }
    },
  },

  {
    name: 'Rust - rustc',
    exts: ['rs'],
    getRuntime([script, ...args], options, config) {
      const output = getUniqueCacheDir('/rust-rustc') + '/output'

      return {
        compile: ['rustc', script, '-o', output],
        exec: [output, ...args],
        installHints: ['Please install Rust from https://www.rust-lang.org'],
      }
    },
  },

  {
    name: 'SASS (CSS)',
    exts: ['sass', 'scss'],
    getRuntime(args, options, config) {
      return {
        exec: ['sass', ...args],
        install: ['npm', 'install', '-g', 'sass'],
        installHints: ['Please install SASS from https://sass-lang.com'],
      }
    },
  },

  {
    name: 'PHP',
    exts: ['php'],
    getRuntime(args, options, config) {
      return {
        exec: ['php', ...args],
        installHints: ['Please install PHP from https://www.php.net'],
      }
    },
  },

  {
    name: 'HTML Server',
    exts: ['html', 'htm'],
    getRuntime([script, ...args], options, config) {
      return {
        exec: ['live-server', path.dirname(script), ...args],
        watchExts: ['css', 'js', 'javascript'],
        install: ['npm', 'install', '-g', 'live-server'],
        installHints: [
          'Please install live-server from https://www.npmjs.com/package/live-server',
        ],
      }
    },
  },
])
