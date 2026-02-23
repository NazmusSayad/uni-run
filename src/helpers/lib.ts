import { randomUUID } from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'

export function getTempOutputFilePath(slug?: string) {
  const ext = process.platform === 'win32' ? '.exe' : ''

  const dirPath = [slug ?? randomUUID(), process.pid, process.ppid].join('-')
  const tempDir = path.join(os.tmpdir(), `uni-run-${dirPath}`)

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
  }

  fs.mkdirSync(tempDir, { recursive: true })
  return path.join(tempDir, 'output' + ext)
}
