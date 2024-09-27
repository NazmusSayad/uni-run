# Arithmetic operations
arith_sum = 0
for i in range(100000000):
  arith_sum += i * 2

# String concatenation
str_concat = ''
for i in range(100000):
  str_concat += 'test'

# Array operations
arr = []
for i in range(100000):
  arr.append(i)
arr_sum = sum(arr)

# Function calls


def square(n):
  return n * n


func_sum = 0
for i in range(1000000):
  func_sum += square(i)
