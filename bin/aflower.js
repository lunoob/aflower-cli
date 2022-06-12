#! /usr/bin/env node
import { Add, Fail } from '../commands/index.js'
import { Command } from 'commander'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const program = new Command()
const packageJson = require('../package.json')

program
    .name('aflower')
    .usage('<command> [option]')
    .version(packageJson.version, '-v --version')

program
    .command('add <config>')
    .description('add tool configuration like: GitLint')
    .action((toolType, args) => {
        (
            Add[toolType] || Fail(toolType, args)
        )()
    })

program.parse(process.argv)
