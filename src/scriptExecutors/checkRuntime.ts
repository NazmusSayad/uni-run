import colors from '../lib/colors'
import confirm from '@inquirer/confirm'
import { RuntimeOptions } from './types.t'
import { sync as spawnSync } from 'cross-spawn'

export default function (runtime: RuntimeOptions) {
  if (!runtime.install?.check?.length) return
  const [command, ...args] = runtime.install.check
  const result = spawnSync(command, args, { stdio: 'ignore' })
  if (result.status === 0) return

  if (runtime.install.hints?.length) {
    console.error(`${runtime.start[0]} is not installed.`)
    console.log(colors.bold('How to install:'))
    runtime.install.hints.forEach((hint) => console.log(hint))
  }

  if (runtime.install.command?.length) {
    confirm({ message: 'Do you want to install it?' }).then((ans) => {
      if (!ans) return
      const [command, ...args] = runtime.install?.command!
      spawnSync(command, args, { stdio: 'inherit' })
    })
  }
}
