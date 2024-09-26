import { spawn } from 'cross-spawn'
import * as readline from 'readline'
import { ChildProcess } from 'child_process'
import watcher from './watcher'
import colors from '../lib/colors'
import killProcess from './kill-process'
import { ExecuteOptions } from '../arg-helper'

export default class Execution {
  private child: ChildProcess | null = null
  private benchMarkText = colors.dim.blue('> Execution time')
  private isBenchmarkRunning = false

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
    if (this.options.benchmarkPrefix) {
      this.benchMarkText =
        colors.bold(this.options.benchmarkPrefix) + ' ' + this.benchMarkText
    }

    if (this.options.keystrokeReload) {
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

    if (this.options.showTime) {
      console.log('@', colors.yellow(new Date().toLocaleString()))
    }

    if (this.options.benchmark) {
      if (this.isBenchmarkRunning) {
        console.timeEnd(this.benchMarkText)
      } else {
        this.isBenchmarkRunning = true
      }

      console.time(this.benchMarkText)
    }

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
        console.log(
          colors.red(`Process exited with code: ${colors.yellow(String(code))}`)
        )
      }

      if (this.options.benchmark) {
        this.isBenchmarkRunning = false
        console.timeEnd(this.benchMarkText)
      }

      if (this.options.watch && this.options.showInfo) {
        console.log(
          colors.dim.blue('> Watching for extensions:'),
          colors.dim(
            this.options.watchExtensions
              .map((ext) => colors.yellow(ext))
              .join(', ') || colors.yellow('*')
          )
        )
      }

      if (this.options.keystrokeReload) {
        console.log(
          colors.blue.dim(
            `> Press ${colors.yellow('F5')} or ${colors.yellow(
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
