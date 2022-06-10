#! /usr/bin/env node
import fse from 'fs-extra'
import path from 'path'
import { Add, Fail } from '../commands'
import { Command } from 'commander'

const packageJsonPath = path.resolve(__dirname, '../../package.json')
const packageJson = fse.readJsonSync(packageJsonPath)

const program = new Command()

program
  .name('aflower')
  .usage('<command> [option]')
  .version(packageJson.version, '-v --version')

program
  .command('add <tool-config>')
  .description('add tool configuration to the project')
  .action((toolType: keyof typeof Add, args: string) => {
    // 处理用户输入 add 指令附加的参数

    (
      Add[toolType] || Fail(toolType, args)
    )()
  })

program.parse(process.argv)
