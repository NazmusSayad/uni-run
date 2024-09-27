// Arithmetic operations
let arithSum = 0
for (let i = 0; i < 100000000; i++) {
  arithSum += i * 2
}

// String concatenation
let strConcat = ''
for (let i = 0; i < 100000; i++) {
  strConcat += 'test'
}

// Array operations
let arr = []
for (let i = 0; i < 100000; i++) {
  arr.push(i)
}
let arrSum = arr.reduce((acc, val) => acc + val, 0)

// Function calls
function square(n) {
  return n * n
}
let funcSum = 0
for (let i = 0; i < 1000000; i++) {
  funcSum += square(i)
}
