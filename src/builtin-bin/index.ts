import Executor from './Executor'

export default [
  new Executor('Node.js', {
    extensions: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],

    checkInstallation: ['node', '--version'],
    installMessage: 'Please install Node.js from https://nodejs.org',

    run(args) {
      return ['node', ...args]
    },
  }),

  new Executor('TypeScript', {
    extensions: ['ts', 'tsx', 'cts', 'ctsx', 'mts', 'mtsx'],
    watchExtensions: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],

    checkInstallation(options) {
      return options.tsNode ? ['ts-node', '--version'] : ['tsx', '--version']
    },
    installCommands(options) {
      return options.tsNode
        ? ['npm install -g ts-node']
        : ['npm install -g tsx']
    },
    installMessage: 'Please install tsx. More: https://tsx.is',

    run(args, options) {
      return options.tsNode ? ['ts-node', ...args] : ['tsx', ...args]
    },
  }),

  new Executor('Python', {
    extensions: ['py'],

    checkInstallation: ['python', '--version'],
    installMessage: 'Please install Python from https://www.python.org',

    run(args) {
      return ['python', ...args]
    },
  }),

  new Executor('Java - Oracle', {
    extensions: ['java'],

    checkInstallation: ['java', '--version'],
    installMessage: 'Please install Java from https://www.oracle.com/java',

    run(args) {
      return ['java', ...args]
    },
  }),

  new Executor('Powershell', {
    extensions: ['ps1'],

    checkInstallation: ['powershell', '-command', 'echo ok'],
    installMessage:
      'Please install Powershell from https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell',

    run(args) {
      return ['powershell', '-File', ...args]
    },
  }),

  new Executor('Command Prompt', {
    extensions: ['cmd', 'bat'],

    checkInstallation: ['cmd', '/c', 'echo ok'],
    installMessage: 'Please install Command Prompt from Windows',

    run(args) {
      return ['cmd', '/c', ...args]
    },
  }),

  new Executor('Shell', {
    extensions: ['sh'],

    checkInstallation: ['bash', '--version'],
    installMessage:
      'Please install Bash from https://www.gnu.org/software/bash',

    run(args) {
      return ['bash', ...args]
    },
  }),

  new Executor('Lua', {
    extensions: ['lua'],

    checkInstallation: ['lua', '--version'],
    installMessage: 'Please install Lua from https://www.lua.org',

    run(args) {
      return ['lua', ...args]
    },
  }),

  new Executor('SASS (CSS)', {
    extensions: ['sass', 'scss'],

    checkInstallation: ['sass', '--version'],
    installCommands: ['npm install -g sass'],
    installMessage: 'Please install SASS from https://sass-lang.com',

    run(args) {
      return ['sass', ...args]
    },
  }),

  new Executor('HTML Server', {
    extensions: ['html', 'htm'],
    watchExtensions: ['css', 'js', 'javascript', 'json'],

    checkInstallation: ['http-server', '--version'],
    installCommands: ['npm install -g http-server'],
    installMessage:
      'Please install http-server from https://www.npmjs.com/package/http-server',

    run(args) {
      return ['http-server', ...args]
    },
  }),
]
