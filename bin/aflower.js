#! /usr/bin/env node
import { Command } from 'commander'
import { createRequire } from 'module'
import { Add, Fail } from '../commands/index.js'
import * as colors from '../helpers/colors.js'

const require = createRequire(import.meta.url)
const program = new Command()
const packageJson = require('../package.json')

program
    .name('aflower')
    .usage('<command> [option]')
    .version(packageJson.version, '-v --version')

program
    .command('add <config>')
    .description(`add tool configuration\neg: ${
        colors.primary(Object.keys(Add).join('、'))
    }`)
    .action((toolType, args) => {
        (
            Add[toolType] || Fail(toolType, args)
        )()
    })

program.parse(process.argv)
