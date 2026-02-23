import fs from 'fs'
import path from 'path'
import { userConfigSchema } from './app/user-config'

const schema = userConfigSchema.toJSONSchema()

fs.writeFileSync(
  path.resolve('./public/uni-run.schema.json'),
  JSON.stringify(schema)
)
