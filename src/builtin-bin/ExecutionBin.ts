import { sync as spawnSync } from 'cross-spawn'

export default class ExecutionBin {
  public displayName: string
  public command: string
  public run: (...args: string[]) => [command: string, ...args: string[]]
  public extensions: Set<string>

  public checkInstallationArgs?: string[]
  public howToInstall?: () => void

  constructor(config: {
    name: string
    command: string
    extensions: string[]
    run: (...args: string[]) => [command: string, ...args: string[]]

    checkInstallationArgs?: string[]
    howToInstall?: () => void
  }) {
    this.displayName = config.name
    this.command = config.command
    this.extensions = new Set(config.extensions)
    this.run = config.run

    this.checkInstallationArgs = config.checkInstallationArgs
    this.howToInstall = config.howToInstall
  }

  isSupported(script: string) {
    return this.extensions.has(script.split('.').pop() || '')
  }

  isInstalled() {
    const result = spawnSync(
      this.command,
      this.checkInstallationArgs ? this.checkInstallationArgs : []
    )

    if (result.status === 1) return false
    return true
  }
}
