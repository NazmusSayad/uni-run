import os from '../helpers/os'
import colors from '../lib/colors'
import confirm from '@inquirer/confirm'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

function isBinaryInstalled(bin: string) {
  const result = spawnSync(os.isWindows ? 'where' : 'which', [bin], {
    stdio: 'ignore',
  })

  return result.status === 0
}

export default async function (runtime: RuntimeOptions): Promise<boolean> {
  if (!runtime.install?.length && !runtime.installHints?.length) return true

  const command = runtime.compile?.[0] ?? runtime.exec[0]
  if (!command) return true

  const isInstalled = isBinaryInstalled(command)
  if (isInstalled) return true

  console.error(colors.yellow(command) + colors.red(' is not installed.'))

  if (runtime.install?.length) {
    const ans = await confirm({ message: 'Do you want to install it?' })
    process.stdin.setRawMode(false)

    if (ans) {
      const [installCmd, ...installArgs] = runtime.install
      const result = spawnSync(installCmd, installArgs, { stdio: 'inherit' })
      if (result.status === 0) {
        process.stdin.resume()
        return true
      }
    }
  }

  if (runtime.installHints?.length) {
    console.log(colors.bold('How to install:'))
    runtime.installHints.forEach((hint) => console.log(hint))
  }

  return false
}
