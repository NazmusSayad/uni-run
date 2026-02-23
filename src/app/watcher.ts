import * as chokidar from 'chokidar'
import * as fs from 'fs'
import ignore from 'ignore'
import * as path from 'path'

export type WatcherOptions = {
  cwd: string
  callback: () => void

  ignore: string[]
  targets: string[]
  extensions: string[]

  debounceDelay: number
}

export function chokidarWatcher(options: WatcherOptions) {
  const uniqueIgnores = [...new Set(options.ignore)]
  const uniqueTargets = [...new Set(options.targets)]
  const uniqueExtensions = [...new Set(options.extensions)]

  const ig = gitignore(options.cwd, uniqueIgnores)

  const watcher = chokidar.watch(uniqueTargets, {
    ignored: (filePath) => {
      for (const target of uniqueTargets) {
        const relativePath = path.relative(target, filePath)
        if (!relativePath) return false
        if (ig.ignores(relativePath)) return true

        if (uniqueExtensions.length) {
          const ext = path.extname(relativePath).slice(1)
          if (ext && !uniqueExtensions.includes(ext)) return true
        }
      }

      return false
    },

    interval: options.debounceDelay / 2,
    ignoreInitial: true,
    persistent: true,
  })

  let debounceTimer: NodeJS.Timeout | null = null
  function handleChange() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      options.callback()
    }, options.debounceDelay)
  }

  watcher.on('add', handleChange)
  watcher.on('change', handleChange)
  watcher.on('unlink', handleChange)
}

function gitignore(baseDir: string, extraIgnore = [] as string[]) {
  const gitignorePath = path.resolve(path.join(baseDir, '.gitignore'))
  const ig = ignore({ ignorecase: true }).add(extraIgnore)

  if (fs.existsSync(gitignorePath)) {
    return ig.add(fs.readFileSync(gitignorePath).toString())
  }

  return ig
}
