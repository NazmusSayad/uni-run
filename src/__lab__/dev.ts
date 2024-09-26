import { app } from '../arg'

// app.start([
//   'C:\\Users\\Sayad\\Desktop\\index.js',
//   '--cwd',
//   'C:\\Users\\Sayad\\Desktop',
//   '--ext',
//   'js',
// ])

console.log('app.start')
app.start([
  // '-h',
  './scripts/main.ts',
  '--clear=false',
  '--env=NODE_ENV=development',
  'OTHER_ENV=thing',
  '--bench',
  '--benchPrefix=TypeScript',
])
// app.start(['./scripts/index.js'])
// app.start(['./scripts/main.py'])
// app.start(['./scripts/master.java'])
