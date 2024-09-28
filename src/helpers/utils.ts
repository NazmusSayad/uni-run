import fs from 'fs'

export function getExistedFile(...files: string[]) {
  for (const file of files) {
    if (fs.existsSync(file)) return file
  }
}

export function getUserPath() {
  return process.env.HOME ?? process.env.USERPROFILE
}
