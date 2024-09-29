import fs from 'fs'
import path from 'path'

export function getExistedFile(...files: string[]) {
  for (const file of files) {
    if (fs.existsSync(file)) return file
  }
}

export function getUserPath() {
  return process.env.HOME ?? process.env.USERPROFILE
}

export function emptyDir(...paths: string[]) {
  const target = path.join(...paths)

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true })
  }

  fs.mkdirSync(target, { recursive: true })

  return target
}
