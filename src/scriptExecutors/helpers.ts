import path from 'path'
import { emptyDir } from '../helpers/utils'

const cacheDir = path.join(__dirname, '../../.cache')

export function getUniqueCacheDir(slug: string) {
  return emptyDir(cacheDir, slug + '-' + `${process.pid}-${process.ppid}`)
}

export function getCacheDir() {
  return cacheDir
}

export function cleanCacheDir() {
  emptyDir(cacheDir)
}
