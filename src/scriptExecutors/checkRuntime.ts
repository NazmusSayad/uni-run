import colors from '../lib/colors'
import confirm from '@inquirer/confirm'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

export default function (runtime: RuntimeOptions) {
  if (!runtime.isInstalled?.length) return
  const [command, ...args] = runtime.isInstalled
  const result = spawnSync(command, args, { stdio: 'ignore' })
  if (result.status === 0) return

  if (runtime.installHints?.length) {
    console.error(`${runtime.run[0]} is not installed.`)
    console.log(colors.bold('How to install:'))
    runtime.installHints.forEach((hint) => console.log(hint))
  }

  if (runtime.install?.length) {
    confirm({ message: 'Do you want to install it?' }).then((ans) => {
      if (!ans) return
      const [command, ...args] = runtime.install!
      spawnSync(command, args, { stdio: 'inherit' })
    })
  }
}
