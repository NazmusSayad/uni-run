import path from 'path'
import { getExistedFile, getUserPath } from './utils'
import { ScriptExecutorOptions } from '../scriptExecutors/types.t'

const EXECUTOR_CONFIG_FILE = '.uni-run.cjs'
export default function (
  ...extraDirs: string[]
): ScriptExecutorOptions[] | undefined {
  const userPath = getUserPath()
  if (!userPath) return

  const configFile = getExistedFile(
    ...extraDirs.map((dir) => path.join(dir, EXECUTOR_CONFIG_FILE)),
    path.join(process.cwd(), EXECUTOR_CONFIG_FILE),
    path.join(userPath, EXECUTOR_CONFIG_FILE)
  )

  if (!configFile) return
  return require(configFile)
}
