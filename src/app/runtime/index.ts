import path from 'path'
import { defaultRuntimes } from './default-runtime'

export function getRuntimeByPath(target: string) {
  const extension = path.extname(target).slice(1)
  return defaultRuntimes.find((runtime) =>
    runtime.extensions.includes(extension)
  )
}
