import * as path from 'path'
import * as chokidar from 'chokidar'
import gitignore from './gitignore'
import { createDebounce } from '../utils/debounce'

export type WatcherOptions = {
  ignore: string[]
  extensions: Set<string>
  debounceDelay: number
}

export default function (
  dir: string,
  options: WatcherOptions,
  callback: () => void
) {
  const ig = gitignore(dir, options.ignore)
  const debounce = createDebounce(options.debounceDelay)

  const watcher = chokidar.watch(dir, {
    ignored: (filePath) => {
      const relativePath = path.relative(dir, filePath)
      if (!relativePath) return false
      if (ig.ignores(relativePath)) return true

      if (options.extensions.size) {
        const ext = path.extname(relativePath).slice(1)
        if (ext && !options.extensions.has(ext)) return true
      }

      return false
    },

    interval: options.debounceDelay / 2,
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('add', (event) => {
    debounce(() => callback())
  })

  watcher.on('change', (event) => {
    debounce(() => callback())
  })

  watcher.on('unlink', () => {
    debounce(() => callback())
  })
}
