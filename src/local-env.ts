type Runtime = 'run' | 'rux'

let RUNTIME = 'run'

export function setRuntime(runtime: Runtime) {
  RUNTIME = runtime
}

export function getRuntime() {
  return RUNTIME
}
