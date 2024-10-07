export default {
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',
  isMac: process.platform === 'darwin',
  isUnix: process.platform === 'linux' || process.platform === 'darwin',
}
