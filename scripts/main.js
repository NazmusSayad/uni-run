let i = 0
let num = setInterval(() => {
  console.log('Hello World', i++)

  if (i === 5) clearInterval(num)
}, 100)
