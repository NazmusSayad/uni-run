function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

for (let i = 0; i < 5; i++) {
  console.log(fibonacci(i))
}
