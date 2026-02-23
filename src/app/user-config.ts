import chalk from 'chalk'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { z } from 'zod'

const USER_CONFIG_PATH = path.join(os.homedir(), '.uni-run.json')

const configSchema = z.object({
  jsRuntime: z.enum(['node', 'deno', 'bun']),
  tsRuntime: z.enum(['tsx', 'ts-node', 'deno', 'bun']),
})

export const userConfigSchema = z.object({
  $schema: z.string().optional(),
  config: configSchema.partial().optional(),
})

export function readUserConfig(): z.infer<typeof userConfigSchema> {
  try {
    if (!fs.existsSync(USER_CONFIG_PATH)) {
      return {}
    }

    const config = fs.readFileSync(USER_CONFIG_PATH, 'utf8')
    return userConfigSchema.parse(JSON.parse(config))
  } catch {
    console.error(chalk.red('Error reading user config'))
    return {}
  }
}
