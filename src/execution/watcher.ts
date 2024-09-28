import * as path from 'path'
import gitignore from './gitignore'
import * as chokidar from 'chokidar'
import { createDebounce } from '../helpers/debounce'

export type WatcherOptions = {
  ignore: string[]
  extensions: Set<string>
  debounceDelay: number
}

export default function (
  cwd: string,
  targets: string | string[],
  callback: () => void,
  options: WatcherOptions
) {
  const ig = gitignore(cwd, options.ignore)
  const debounce = createDebounce(options.debounceDelay)

  const watcher = chokidar.watch(targets, {
    ignored: (filePath) => {
      for (const target of targets) {
        const relativePath = path.relative(target, filePath)
        if (!relativePath) return false
        if (ig.ignores(relativePath)) return true

        if (options.extensions.size) {
          const ext = path.extname(relativePath).slice(1)
          if (ext && !options.extensions.has(ext)) return true
        }
      }

      return false
    },

    interval: options.debounceDelay / 2,
    ignoreInitial: true,
    persistent: true,
  })

  watcher.on('add', () => debounce(() => callback()))
  watcher.on('change', () => debounce(() => callback()))
  watcher.on('unlink', () => debounce(() => callback()))
}
