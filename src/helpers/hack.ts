type SystemRuntime = 'run' | 'rux'

export function getSystemRuntime(): SystemRuntime {
  return (process.env.SYSTEM_RUNTIME ?? 'run') as SystemRuntime
}

export function setSystemRuntime(runtime: SystemRuntime) {
  process.env.SYSTEM_RUNTIME = runtime
}
