#! /usr/bin/env node
import packageJson from '../package.json'
import { Add, Fail } from '../commands'
import { Command } from 'commander'

const program = new Command()

program
  .name('aflower')
  .usage('<command> [option]')
  .version(packageJson.version, '-v --version')

program
  .command('add <tool-config>')
  .description('add tool configuration to the project')
  .action((toolType: keyof typeof Add, args: string) => {
    (
      Add[toolType] || Fail(toolType, args)
    )()
  })

program.parse(process.argv)
