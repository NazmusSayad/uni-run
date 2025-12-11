import path from 'path'
import { emptyDir } from '../helpers/utils'

const cacheDir = path.join(__dirname, '../../.cache')

export function getOutputFileName(slug: string) {
  const ext = process.platform === 'win32' ? '.exe' : ''
  const dir = emptyDir(cacheDir, slug + '-' + `${process.pid}-${process.ppid}`)
  return path.join(dir, 'output' + ext)
}

export function getCacheDir() {
  return cacheDir
}

export function cleanCacheDir() {
  emptyDir(cacheDir)
}
