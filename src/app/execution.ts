import chalk from 'chalk'
import { ChildProcess, spawn } from 'child_process'
import * as readline from 'readline'
import { AppExecutionConfig } from './config'
import { killProcess } from './kill-ps'
import { chokidarWatcher } from './watcher'

type ExecutionOptions = AppExecutionConfig & {
  startArgs: string[]
  preStartArgs?: string[]
}

export class Execution {
  private child: ChildProcess | null = null
  private benchMarkText = chalk.dim.green('# Execution time')
  private isBenchmarkRunning = false
  private isExecutionExecutedAnyTime = false

  constructor(private options: ExecutionOptions) {
    this.setup()
  }

  start() {
    return this.startProcess()
  }

  private spawn(args: string[]) {
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

        ignore: this.options.watchIgnores,
        targets: this.options.watchTargets,
        extensions: this.options.watchExtensions,

        debounceDelay: this.options.watchDelay,
      })
    }
  }

  private async startProcess() {
    this.killProcess()
    this.clearBeforeStart()
    this.renderInfoLogs()
    this.isExecutionExecutedAnyTime = true

    if (this.options.preStartArgs) {
      const result = this.spawn(this.options.preStartArgs)

      await new Promise((resolve) => {
        result.on('close', (code) => {
          resolve(code === 0 ? null : code)
        })
      })
    }

    this.startBenchmark()
    this.child = this.spawn(this.options.startArgs)
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

      if (this.options.watchTargets.length) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('Watching target:'),
          chalk.dim(
            this.options.watchTargets
              .map((ext) => chalk.reset(ext))
              .join(', ') || chalk.yellow('*')
          )
        )
      }

      if (this.options.watchIgnores.length) {
        console.log(
          chalk.dim.bgGreen('INFO:'),
          chalk.green('Watching ignore:'),
          chalk.dim(
            this.options.watchIgnores
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
