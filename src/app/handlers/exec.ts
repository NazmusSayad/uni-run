import { appExecutionConfig } from '../config'
import { app } from './app'

export const exec = app.create('exec', {
  ...appExecutionConfig,
  description: 'Execute a script with the given binary',
})
