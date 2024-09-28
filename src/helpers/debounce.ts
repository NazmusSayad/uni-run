export function createDebounce(delay: number) {
  let debounceTimeout: NodeJS.Timeout
  return function (fn: () => void) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => fn(), delay)
  }
}
