import fs from 'fs'
import path from 'path'
import { getExistedFile, getUserPath } from './utils'

export default function (...extraDirs: string[]) {
  const userPath = getUserPath()
  if (!userPath) return

  const configFile = getExistedFile(
    ...extraDirs.map((dir) => path.join(dir, '/.uni-run.json')),
    path.join(process.cwd(), '/.uni-run.json'),
    path.join(userPath, '/.uni-run.json')
  )
  if (!configFile) return

  try {
    const config = fs.readFileSync(configFile, 'utf-8')
    return JSON.parse(config)
  } catch {
    return {}
  }
}
