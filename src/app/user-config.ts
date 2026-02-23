import chalk from 'chalk'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { z } from 'zod'

const USER_CONFIG_PATH = path.join(os.homedir(), '.uni-run.json')

const runtimeSchema = z.object({
  python: z.enum(['python', 'python3', 'uv']),

  javascript: z.enum(['node', 'deno', 'bun']),

  typescript: z.enum(['tsx', 'ts-node', 'deno', 'bun']),

  dart: z.enum(['dart', 'dartvm']),

  powershell: z.enum(['powershell', 'pwsh']),

  shell: z.enum(['bash', 'zsh', 'sh']),

  lua: z.enum(['lua', 'luac', 'luajit']),
})

export const userConfigSchema = z.object({
  $schema: z.string().optional(),
  runtime: runtimeSchema.partial().optional(),
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
