import ExecutionBin from './ExecutionBin'

export default [
  new ExecutionBin({
    name: 'Node.js',
    command: 'node',
    extensions: ['js', 'javascript', 'jsx', 'cjs', 'cjsx', 'mjs', 'mjsx'],
    run(...args) {
      return [this.command, ...args]
    },

    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Node.js from https://nodejs.org/')
    },
  }),

  new ExecutionBin({
    name: 'TypeScript',
    command: 'ts-node',
    extensions: ['ts', 'tsx', 'cts', 'ctsx', 'mts', 'mtsx'],
    run(...args) {
      return [this.command, ...args]
    },

    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log(
        'Please install ts-node from https://www.npmjs.com/package/ts-node'
      )
    },
  }),

  new ExecutionBin({
    name: 'python',
    command: 'python',
    extensions: ['py'],
    run(...args) {
      return [this.command, ...args]
    },

    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Python from https://www.python.org/')
    },
  }),

  new ExecutionBin({
    name: 'java',
    command: 'java',
    extensions: ['java'],
    run(...args) {
      return [this.command, ...args]
    },

    checkInstallationArgs: ['--version'],
    howToInstall: () => {
      console.log('Please install Java from https://www.oracle.com/java/')
    },
  }),
]
