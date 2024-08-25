import * as readline from 'readline'
import { ChildProcess } from 'child_process'
import { spawn } from 'cross-spawn'
import colors from './utils/colors'
import watcher from './watcher'

export type ExecuteOptions = {
  cwd: string
  clearOnReload: boolean
  readlineReload: boolean
  watch: boolean
  watchDelay: number
  watchIgnore: string[]
  watchExtensions: string[]
  env?: Record<string, string>
}

export default function (
  [command, ...args]: string[],
  options: ExecuteOptions
) {
  if (options.readlineReload) {
    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode?.(true)
    process.stdin.on('keypress', (_, key) => {
      if (key.name === 'f5') return exec()
      if ((key.ctrl || key.meta) && key.name === 'r') return exec()

      if (key.ctrl && key.name === 'c') {
        console.log('^C...')
        process.exit(0)
      }
    })
  }

  if (options.watch) {
    watcher(
      options.cwd,
      {
        ignore: options.watchIgnore,
        debounceDelay: options.watchDelay,
        extensions: new Set(options.watchExtensions),
      },
      () => exec()
    )
  }

  let child: ChildProcess | null = null
  function exec() {
    if (options.clearOnReload) {
      process.stdout.write('\x1Bc')
      console.clear()
    }

    if (child) {
      child.removeAllListeners()
      child.kill()
    }

    child = spawn(command, args, {
      argv0: command,
      cwd: options.cwd,
      stdio: 'inherit',
      env: { ...options.env },
    })

    child.on('error', console.error)
    child.on('exit', (code) => {
      if (code && code > 0) {
        console.log('')
        console.log(
          colors.red(`Process exited with code: ${colors.yellow(String(code))}`)
        )
      }

      if (options.readlineReload) {
        console.log(
          colors.blue.dim(
            `⟳ Press ${colors.yellow('F5')} or ${colors.yellow(
              '^R'
            )} to reload...`
          )
        )
      }
    })
  }

  exec()
}
