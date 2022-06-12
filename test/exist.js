import fse from 'fs-extra'
import path from 'path'

const targetPath = path.resolve(process.cwd(), 'vite.config.js')

console.log(targetPath)

console.log(
    fse.existsSync(targetPath)
)
