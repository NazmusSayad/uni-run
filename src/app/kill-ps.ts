import { ChildProcess, execSync } from 'child_process'
import * as os from 'os'

export function killProcess(child: ChildProcess) {
  if (!child.pid) return true
  child.removeAllListeners()
  const isWindows = os.platform() === 'win32'

  try {
    if (isWindows) {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' })
    } else {
      process.kill(-child.pid, 'SIGKILL')
    }
  } catch {}

  try {
    process.kill(child.pid, 0)
    return false
  } catch {
    return true
  }
}
