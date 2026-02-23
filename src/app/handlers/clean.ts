import { TEMP_DIR } from '@/helpers/lib'
import chalk from 'chalk'
import fs from 'fs'
import { app } from './app'

export const clean = app.create('clean', {
  description: 'Clean cache directory',
})

clean.on(async () => {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }

  console.log(chalk.green('Cache directory cleaned:'), TEMP_DIR)
})
