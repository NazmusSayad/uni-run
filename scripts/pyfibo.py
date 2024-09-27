def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a = b
        b = a + b
        print(b)


fib(100)
