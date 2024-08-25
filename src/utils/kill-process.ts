import * as os from 'os'
import { ChildProcess, execSync } from 'child_process'

export function killChildProcess(child: ChildProcess) {
  if (!child.pid) return
  child.removeAllListeners()
  const isWindows = os.platform() === 'win32'

  try {
    if (isWindows) {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' })
    } else {
      process.kill(-child.pid, 'SIGKILL')
    }
  } catch (error) {
    console.error(
      `Failed to kill child process${isWindows ? ' on Windows' : ''}:`,
      error
    )
  }
}
