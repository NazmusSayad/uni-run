import chalk from 'chalk'
import { ChildProcess } from 'child_process'
import { spawn, sync as spawnSync } from 'cross-spawn'
import * as readline from 'readline'
import { ExecutionConfig } from './config'
import { killProcess } from './kill-ps'
import { chokidarWatcher } from './watcher'

export class Execution {
  private child: ChildProcess | null = null
  private benchMarkText = chalk.dim.green('# Execution time')
  private isBenchmarkRunning = false
  private isExecutionExecutedAnyTime = false

  constructor(
    private options: ExecutionConfig,
    private startArgs: string[],
    private preStartArgs?: string[]
  ) {
    this.setup()
  }

  start() {
    this.startProcess()
  }

  private spawnSync(args: string[]) {
    const [command, ...args_] = args
    return spawnSync(command, args_, {
      argv0: command,
      cwd: this.options.cwd,
      shell: this.options.shell,
      env: { ...process.env, ...this.options.env },
      stdio: this.options.silent ? 'ignore' : 'inherit',
    })
  }

  private spawnAsync(args: string[]) {
    const [command, ...args_] = args
    return spawn(command, args_, {
      argv0: command,
      cwd: this.options.cwd,
      shell: this.options.shell,
      env: { ...process.env, ...this.options.env },
      stdio: this.options.silent ? 'ignore' : 'inherit',
    })
  }

  private setup() {
    if (this.options.benchmarkPrefix) {
      this.benchMarkText =
        chalk.bold(this.options.benchmarkPrefix) + ' ' + this.benchMarkText
    }

    if (this.options.keystrokeReload) {
      readline.emitKeypressEvents(process.stdin)

      if (!this.options.stdinSafeMode) {
        process.stdin.setRawMode(true)
      }

      process.stdin.on('keypress', (_, key) => {
        if (key.name === 'f5' || (key.ctrl && key.name === 'r')) {
          return this.startProcess()
        }

        if (key.ctrl && key.name === 'c') {
          this.killProcess()
          process.exit(0)
        }
      })
    }

    if (this.options.watch) {
      chokidarWatcher({
        cwd: this.options.cwd,
        callback: () => this.startProcess(),

        ignore: this.options.watchIgnore,
        targets: this.options.watchFocus,
        extensions: this.options.watchExtensions,

        debounceDelay: this.options.watchDelay,
      })
    }
  }

  private startProcess() {
    this.killProcess()
    this.clearBeforeStart()
    this.renderInfoLogs()
    this.isExecutionExecutedAnyTime = true

    if (this.preStartArgs) {
      this.spawnSync(this.preStartArgs)
    }

    this.startBenchmark()
    this.child = this.spawnAsync(this.startArgs)
    this.child.on('exit', (code) => {
      this.endBenchmark()

      if (code && code > 0) {
        console.log(
          chalk.red(`Process exited with code: ${chalk.yellow(String(code))}`)
        )
      }

      if (this.options.keystrokeReload) {
        console.log(
          chalk.blue.dim(
            `> Press ${chalk.yellow('F5')} or ${chalk.yellow(
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
    const isKilled = killProcess(this.child)
    if (!isKilled) {
      console.error(
        chalk.bgRed('ERROR:'),
        chalk.red('Failed to kill the previous process')
      )
    }

    this.child = null
  }

  private clearBeforeStart() {
    if (this.options.clearOnReload) {
      process.stdout.write('\x1Bc')
      process.stdout.cursorTo(0, 0)
      process.stdout.clearScreenDown()
      console.clear()
    }
  }

  private renderInfoLogs() {
    if (this.options.showInfo && !this.isExecutionExecutedAnyTime) {
      if (this.options.watch) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('Watching for extensions:'),
          chalk.dim(
            this.options.watchExtensions
              .map((ext) => chalk.reset(ext))
              .join(', ') || chalk.yellow('*')
          )
        )
      }

      if (this.options.watchFocus.length) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('Watching target:'),
          chalk.dim(
            this.options.watchFocus.map((ext) => chalk.reset(ext)).join(', ') ||
              chalk.yellow('*')
          )
        )
      }

      if (this.options.watchIgnore.length) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('Watching ignore:'),
          chalk.dim(
            this.options.watchIgnore
              .map((ext) => chalk.reset(ext))
              .join(', ') || chalk.yellow('*')
          )
        )
      }

      if (this.options.shell) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('SHELL mode enabled')
        )
      }
    }

    if (this.options.showTime) {
      console.log(
        chalk.dim.bgGreen('TIME:'),
        chalk.green(new Date().toLocaleString())
      )
    }
  }

  private startBenchmark() {
    if (this.options.benchmark) {
      if (this.isBenchmarkRunning) {
        console.timeEnd(this.benchMarkText)
      } else {
        this.isBenchmarkRunning = true
      }

      console.time(this.benchMarkText)
    }
  }

  private endBenchmark() {
    if (this.isBenchmarkRunning) {
      console.timeEnd(this.benchMarkText)
      this.isBenchmarkRunning = false
    }
  }
}
