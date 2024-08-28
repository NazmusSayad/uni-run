import NoArg from 'noarg'
import { executionConfig } from './arg-helper'

export const app = NoArg.create('uni-run', {
  ...executionConfig,

  description: 'A universal runner for scripts',
  system: { splitListByComma: true },
  arguments: [
    { name: 'script', type: NoArg.string(), description: 'Run a script' },
  ],

 
})

export const exec = app.create('exec', {
  ...executionConfig,
  description: 'Execute a script with the given binary',
})

export const support = app.create('support', {
  description: 'List supported scripts',
})
