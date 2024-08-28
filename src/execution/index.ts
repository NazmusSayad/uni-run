import { spawn } from 'cross-spawn'
import * as readline from 'readline'
import { ChildProcess } from 'child_process'
import watcher from './watcher'
import colors from '../lib/colors'
import killProcess from './kill-process'

export default class Execution {
  private child: ChildProcess | null = null

  static start([command, ...args]: string[], options: ExecuteOptions) {
    return new Execution(command, args, options)
  }

  constructor(
    private command: string,
    private args: string[],
    private options: ExecuteOptions
  ) {
    this.setup()
    this.runProcess()
  }

  private setup() {
    if (this.options.readlineReload) {
      readline.emitKeypressEvents(process.stdin)
      process.stdin.setRawMode?.(true)
      process.stdin.on('keypress', (_, key) => {
        if (key.name === 'f5' || (key.ctrl && key.name === 'r')) {
          return this.runProcess()
        }

        if (key.ctrl && key.name === 'c') {
          this.killProcess()
          return process.exit(0)
        }
      })
    }

    if (this.options.watch) {
      watcher(
        this.options.cwd,
        {
          ignore: this.options.watchIgnore,
          debounceDelay: this.options.watchDelay,
          extensions: new Set(this.options.watchExtensions),
        },
        () => this.runProcess()
      )
    }
  }

  private runProcess() {
    this.killProcess()
    this.clearBeforeStart()

    this.child = spawn(this.command, this.args, {
      stdio: 'inherit',
      argv0: this.command,
      cwd: this.options.cwd,
      shell: this.options.shell,
      env: { ...this.options.env },
    })

    this.child.on('error', console.error)
    this.child.on('exit', (code) => {
      if (code && code > 0) {
        console.log('')
        console.log(
          colors.red(`Process exited with code: ${colors.yellow(String(code))}`)
        )
      }

      if (this.options.readlineReload) {
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

  private killProcess() {
    if (!this.child) return
    this.child.removeAllListeners()
    if (!killProcess(this.child)) {
      console.error(colors.red('Failed to kill the previous process'))
    }

    this.child = null
  }

  private clearBeforeStart() {
    if (this.options.clearOnReload) {
      process.stdout.write('\x1Bc')
      console.clear()
    }
  }
}

export type ExecuteOptions = {
  cwd: string
  clearOnReload: boolean
  readlineReload: boolean
  watch: boolean
  watchDelay: number
  watchIgnore: string[]
  watchExtensions: string[]
  env: Record<string, string>
  shell: boolean
}
