#! /usr/bin/env node
import figlet from 'figlet'
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
    .description(`add tool configuration\nsupport: ${
        colors.primary(Object.keys(Add).join(' '))
    }`)
    .action((toolType, args) => {
        (
            Add[toolType] || Fail(toolType, args)
        )()
    })

program.addHelpText(
    'before',
    colors.primary(
        figlet.textSync('AFlower')
    ) + '\r\n'
)

program.parse(process.argv)
