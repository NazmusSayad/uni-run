import Execution from '../execution'
import confirm from '@inquirer/confirm'
import { ExecuteOptions } from '../arg-helper'
import { sync as spawnSync } from 'cross-spawn'

type BinConfig = {
  extensions: string[]
  watchExtensions?: string[]
  run: (args: string[], options: ExecuteOptions) => string[]
  installMessage?: string
  installCommands?: string[] | ((options: ExecuteOptions) => string[])
  checkInstallation?: string[] | ((options: ExecuteOptions) => string[])
}

export default class Executor {
  constructor(private name: string, private config: BinConfig) {
    this.config.watchExtensions?.push(...this.config.extensions)
  }

  getName() {
    return this.name
  }

  getRelatedExts() {
    return [...this.config.extensions, ...(this.config.watchExtensions ?? [])]
  }

  start(options: ExecuteOptions, args: string[]) {
    if (!this.isInstalled(options)) {
      return this.renderHowToInstall(options)
    }

    Execution.start(this.config.run(args, options), options)
  }

  isSupported(script: string) {
    return this.config.extensions.includes(script.split('.').pop() || '')
  }

  private isInstalled(options: ExecuteOptions) {
    if (!this.config.checkInstallation) return true

    const [command, ...args] =
      typeof this.config.checkInstallation === 'function'
        ? this.config.checkInstallation(options)
        : this.config.checkInstallation || []

    const result = spawnSync(command, args, {
      stdio: 'ignore',
    })

    if (result.status === 1) return false
    return true
  }

  private renderHowToInstall(options: ExecuteOptions) {
    console.error(`${this.name} is not installed.`)
    if (this.config.installMessage) {
      console.log('How to install:')
      console.log(this.config.installMessage)
    }

    const commands =
      typeof this.config.installCommands === 'function'
        ? this.config.installCommands(options)
        : this.config.installCommands

    if (!commands || !commands.length) return
    confirm({ message: 'Do you want to install it?' }).then((ans) => {
      if (!ans) return

      commands.forEach(([command, ...args]) => {
        if (!command) return
        spawnSync(command, args, { stdio: 'inherit' })
      })
    })
  }
}
