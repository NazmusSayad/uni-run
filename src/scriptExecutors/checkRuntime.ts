import colors from '../lib/colors'
import confirm from '@inquirer/confirm'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

export default async function (runtime: RuntimeOptions): Promise<boolean> {
  if (!runtime.install && !runtime.installHints) return true

  const command = runtime.exec[0]
  if (!command) return true
  const result = spawnSync('which', [command], { stdio: 'ignore' })
  if (result.status === 0) return true

  console.error(colors.yellow(command) + colors.red(' is not installed.'))
  if (!runtime.install?.length) return false

  const ans = await confirm(
    { message: 'Do you want to install it?' },
    { clearPromptOnDone: true }
  )
  process.stdin.resume()

  if (ans) {
    const [installCmd, ...installArgs] = runtime.install
    const result = spawnSync(installCmd, installArgs, { stdio: 'inherit' })
    return result.status === 0
  }

  if (runtime.installHints?.length) {
    console.log(colors.bold('How to install:'))
    runtime.installHints.forEach((hint) => console.log(hint))
  }

  return false
}
