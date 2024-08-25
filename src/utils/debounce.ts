export function createDebounce(delay: number) {
  let debounceTimeout: NodeJS.Timeout
  return function (fn: Function) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => fn(), delay)
  }
}
