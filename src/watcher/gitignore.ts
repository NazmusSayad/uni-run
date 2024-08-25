import * as fs from 'fs'
import * as path from 'path'
import ignore from 'ignore'

export default function (baseDir: string, extraIgnore = [] as string[]) {
  const gitignorePath = path.resolve(path.join(baseDir, '.gitignore'))
  const ig = ignore({ ignorecase: true }).add(extraIgnore)

  if (fs.existsSync(gitignorePath)) {
    return ig.add(fs.readFileSync(gitignorePath).toString())
  }

  return ig
}
