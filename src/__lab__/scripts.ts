import fs from 'fs'
import path from 'path'
import { app } from '../arg'
import colors from '../lib/colors'
const scriptsDir = path.resolve('./scripts')
const scripts = fs
  .readdirSync(scriptsDir)
  .filter((script) => !script.startsWith('-'))
  .map((script) => path.join(scriptsDir, script))

function start(args: string[]) {
  app.start([...args, '--exit'])
}

console.log(
  colors.bgGreen(' START '),
  `Available scripts: ${colors.yellow(String(scripts.length))}`,
  '\n'
)

scripts.forEach((script) => {
  if (script.startsWith('-')) return
  start([script])
})
