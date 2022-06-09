#! /usr/bin/env node
import gitlint from '../gitlint'
import { Command } from 'commander'

const commandHandle: Record<string, () => void> = {
  gitlint
}

const program = new Command()

program
  .name('aflower')
  .usage('<command> [option]')
  .version('0.0.1', '-v --version')

program
  .command('add <tool-config>')
  .description('add tool configuration to the project')
  .action((toolType: string) => {
    // 处理用户输入 add 指令附加的参数

    (
      commandHandle[toolType] || (() => {})
    )()
  })

program.parse(process.argv)
