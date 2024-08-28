import Executor from './Executor'

export default [
  new Executor('Node.js', {
    command: 'node',
    extensions: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
    watchExtensions: ['html', 'css', 'json'],

    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Node.js from https://nodejs.org')
    },
  }),

  new Executor('TypeScript', {
    command: 'ts-node',
    extensions: ['ts', 'tsx', 'cts', 'ctsx', 'mts', 'mtsx'],
    watchExtensions: [
      'html',
      'css',
      'json',
      'js',
      'javascript',
      'jsx',
      'cjs',
      'cjsx',
      'mjs',
      'mjsx',
    ],

    checkInstallationArgs: ['--version'],
    installCommands: [{ command: 'npm', args: ['install', '-g', 'ts-node'] }],
    howToInstall: () => {
      console.log(
        'Please install ts-node from https://www.npmjs.com/package/ts-node'
      )
    },
  }),

  new Executor('Python', {
    command: 'python',
    extensions: ['py'],
    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Python from https://www.python.org')
    },
  }),

  new Executor('Java - Oracle', {
    command: 'java',
    extensions: ['java'],
    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Java from https://www.oracle.com/java')
    },
  }),

  new Executor('Powershell', {
    command: 'powershell',
    extensions: ['ps1'],
    checkInstallationArgs: ['-command', '"Get-Host"'],
    howToInstall: () => {
      console.log(
        'Please install Powershell from https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell'
      )
    },
  }),

  new Executor('Command Prompt', {
    command: 'cmd',
    runArgs: ['/c'],
    extensions: ['cmd', 'bat'],
    checkInstallationArgs: ['/c', 'echo', 'ok'],
    howToInstall: () => {
      console.log('Please install Command Prompt from Windows')
    },
  }),

  new Executor('Shell', {
    command: 'bash',
    extensions: ['sh'],
    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Bash from https://www.gnu.org/software/bash')
    },
  }),

  new Executor('Lua', {
    command: 'lua',
    extensions: ['lua'],
    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Lua from https://www.lua.org')
    },
  }),

  new Executor('SASS (CSS)', {
    command: 'sass',
    extensions: ['sass', 'scss'],
    checkInstallationArgs: ['--version'],
    installCommands: [{ command: 'npm', args: ['install', '-g', 'sass'] }],
    howToInstall: () => {
      console.log('Please install SASS from https://sass-lang.com')
    },
  }),

  new Executor('HTML Server', {
    command: 'http-server',
    extensions: ['html', 'htm'],
    watchExtensions: ['css', 'js', 'javascript', 'json'],
    checkInstallationArgs: ['--version'],
    installCommands: [
      { command: 'npm', args: ['install', '-g', 'http-server'] },
    ],
    howToInstall: () => {
      console.log(
        'Please install http-server from https://www.npmjs.com/package/http-server'
      )
    },
  }),
]
