import fs from 'fs'
import path from 'path'
import { userConfigSchema } from './app/user-config'

const schema = userConfigSchema.toJSONSchema()
const outputPath = path.resolve('./schema.json')

if (fs.existsSync(outputPath)) {
  fs.rmSync(outputPath)
}

fs.writeFileSync(outputPath, JSON.stringify(schema))
