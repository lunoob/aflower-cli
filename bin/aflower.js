#! /usr/bin/env node
const packageJson = require('../package.json')
const { Add, Fail } = require('../commands')
const { Command } = require('commander')

const program = new Command()

program
    .name('aflower')
    .usage('<command> [option]')
    .version(packageJson.version, '-v --version')

program
    .command('add <tool-config>')
    .description('add tool configuration to the project')
    .action((toolType, args) => {
        (
            Add[toolType] || Fail(toolType, args)
        )()
    })

program.parse(process.argv)
