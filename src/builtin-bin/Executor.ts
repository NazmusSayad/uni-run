import confirm from '@inquirer/confirm'
import { sync as spawnSync } from 'cross-spawn'

type ExecutionBinConfig = {
  command: string
  extensions: string[]
  watchExtensions?: string[]

  runArgs?: string[]
  checkInstallationArgs?: string[]
  howToInstall?: () => void
  installCommands?: { command: string; args: string[] }[]
}

export default class Executor {
  constructor(public name: string, public config: ExecutionBinConfig) {
    this.config.watchExtensions?.push(...this.config.extensions)
  }

  getArgs(...args: string[]) {
    return [this.config.command, ...(this.config.runArgs ?? []), ...args]
  }

  isSupported(script: string) {
    return this.config.extensions.includes(script.split('.').pop() || '')
  }

  isInstalled() {
    const result = spawnSync(
      this.config.command,
      [...(this.config.checkInstallationArgs || [])],
      { stdio: 'ignore' }
    )

    if (result.status === 1) return false
    return true
  }

  renderHowToInstall() {
    console.error(`${this.name} is not installed.`)
    if (this.config.howToInstall) {
      console.log('How to install:')
      this.config.howToInstall()
    }

    if (!this.config.installCommands?.length) return
    confirm({ message: 'Do you want to install it?' }).then((ans) => {
      if (!ans) return

      this.config.installCommands?.forEach(({ command, args }) => {
        if (!command) return
        spawnSync(command, args, { stdio: 'inherit' })
      })
    })
  }
}
