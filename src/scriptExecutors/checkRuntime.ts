import colors from '../lib/colors'
import { confirm } from '@inquirer/prompts'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

export default async function (runtime: RuntimeOptions): Promise<boolean> {
  const install = runtime.install
  if (!install) return true

  if (!install.check?.length) return true
  const [checkCmd, ...checkArgs] = install.check

  const result = spawnSync(checkCmd, checkArgs, { stdio: 'ignore' })
  if (result.status === 0) return true

  console.error(
    colors.yellow(runtime.exec[0]) + colors.red(' is not installed.')
  )

  if (!install.command?.length) return false
  const ans = await confirm({ message: 'Do you want to install it?' })
  process.stdin.setRawMode(false)
  process.stdin.resume()

  if (ans) {
    const [installCmd, ...installArgs] = install.command
    const result = spawnSync(installCmd, installArgs, { stdio: 'inherit' })
    return result.status === 0
  }

  if (install.hints?.length) {
    console.log(colors.bold('How to install:'))
    install.hints.forEach((hint) => console.log(hint))
  }

  return false
}
