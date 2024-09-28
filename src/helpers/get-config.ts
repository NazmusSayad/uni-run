import fs from 'node:fs'
import path from 'node:path'

function getExistedFile(...files: string[]) {
  for (const file of files) {
    if (fs.existsSync(file)) return file
  }
}

export default function () {
  const userPath = process.env.HOME ?? process.env.USERPROFILE
  if (!userPath) return

  const configFile = getExistedFile(
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
