import confirm from '@inquirer/confirm'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

export default function (runtime: RuntimeOptions) {
  if (!isInstalled(runtime.isInstalled)) {
    renderHowToInstall(runtime.run[0], runtime.installHints)
    return canBeInstalled(runtime.install)
  }
}

function isInstalled(commands?: string[]) {
  if (!commands?.length) return true
  const [command, ...args] = commands

  const result = spawnSync(command, args, {
    stdio: 'ignore',
  })

  if (result.status === 1) return false
  return true
}

function renderHowToInstall(name: string, hints?: string[]) {
  if (!hints?.length) return

  console.error(`${name} is not installed.`)
  console.log('How to install:')
  hints.forEach((hint) => console.log(hint))
}

function canBeInstalled(installCommands?: string[]) {
  if (!installCommands?.length) return false

  confirm({ message: 'Do you want to install it?' }).then((ans) => {
    if (!ans) return
    const [command, ...args] = installCommands
    spawnSync(command, args, { stdio: 'inherit' })
  })
}
