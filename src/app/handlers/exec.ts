import { executionConfig } from '../config'
import { app } from './app'

export const exec = app.create('exec', {
  ...executionConfig,
  description: 'Execute a script with the given binary',
})
