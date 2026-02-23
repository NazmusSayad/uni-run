import chalk from 'chalk'
import { randomUUID } from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'

export const TEMP_DIR = path.join(os.tmpdir(), 'uni-run')

export function getTempOutputFilePath(slug?: string) {
  const ext = process.platform === 'win32' ? '.exe' : ''

  const dirPath = [slug ?? randomUUID(), process.pid, process.ppid].join('-')
  const tempDir = path.join(TEMP_DIR, dirPath)

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
  }

  fs.mkdirSync(tempDir, { recursive: true })
  return path.join(tempDir, 'output' + ext)
}

export function installTip(runtime: string) {
  const platform = os.platform()
  const platformName = platform === 'win32' ? 'Windows' : platform

  console.log('')
  console.log(
    `${chalk.bold(
      chalk.blue('G') +
        chalk.red('O') +
        chalk.yellow('O') +
        chalk.blue('G') +
        chalk.green('L') +
        chalk.red('E')
    )}:`
  )
  console.log(
    `https://google.com/search?q=${encodeURIComponent(`How to install "${runtime}" on ${platformName}`)}`
  )

  const prompt = [
    `I have to install "${runtime}" on ${platformName}`,
    'Guide me through the process of installing it',
  ].join('\n')

  console.log('')
  console.log(chalk.white.bold('ChatGPT') + ':')
  console.log(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`)

  console.log('')
  console.log(chalk.green.bold('Copy Prompt') + ':')
  console.log(prompt)
}
