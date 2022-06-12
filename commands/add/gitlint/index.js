/**
* @fileoverview Gitlint config module
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import path from 'path'
import fse from 'fs-extra'
import stringify from 'json-stable-stringify-without-jsonify'
import ora from 'ora'
import { exec } from 'child_process'
import { createRequire } from 'module'
import { intersection, difference } from 'lodash-es'
import { findPackageJson, installSyncSaveDev } from '../../../helpers/npm_utils.js'
import { formatByEslint } from '../../../helpers/lint.js'
import * as log from '../../../helpers/logging.js'
import * as colors from '../../../helpers/colors.js'

const require = createRequire(import.meta.url)
const cwd = process.cwd()
const { prompt } = require('enquirer')

const needInstallDependencies = [
    'commitizen',
    'husky',
    'lint-staged',
    '@commitlint/config-conventional'
]

const configFiles = {
    lintstage: '.lintstagedrc.json',
    commitlint: 'commitlint.config.cjs',
    pkg: 'package.json'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Add husky config and git hook
 * @returns {any}
 */
function husky () {
    const spinner = ora('Husky Configuring\n').start()
    // 1. 增加 npm script 命令 "prepare": "husky install"
    // 2. 增加 husky 钩子
    const commands = [
        'npm set-script prepare "husky install"',
        'npm set-script cz "git-cz"',
        'npx husky install',
        'npx husky set .husky/pre-commit "npx lint-staged"',
        'npx husky set .husky/commit-msg "npx commitlint -e"'
    ]
    return new Promise((resolve, reject) => {
        const subprocess = exec(commands.join(' && '))

        subprocess.stderr.on('data', data => {
            reject(data)
        })

        subprocess.on('exit', () => {
            spinner.stop()
            resolve('')
        })
    })
}

/**
 * Add lint-stage config
 * @returns {any}
 */
async function lintstage () {
    const lintStagePath = path.resolve(cwd, configFiles.lintstage)

    let content = {}

    // whether exist
    if (fse.existsSync(lintStagePath)) {
        content = fse.readJsonSync(lintStagePath)
    }
    content['*.{js,ts}'] = ['eslint --fix']

    fse.writeJsonSync(lintStagePath, content, { spaces: 4 })
    log.info(`✅ ${colors.success('lintstaged')} config created`)
}

/**
 * Add commitlint config
 * @returns {any}
 */
async function commitlint () {
    const filePath = path.resolve(cwd, configFiles.commitlint)

    let content = {}

    // whether exist
    if (fse.existsSync(filePath)) {
        content = (await import(filePath)).default
    }

    // if a empty obj
    if (Object.keys(content).length === 0) {
        content = {
            extends: ['@commitlint/config-conventional']
        }
    } else {
        // if extends attribute not exist
        if (!content.extends) {
            content.extends = ['@commitlint/config-conventional']
        } else {
            const extendsSet = new Set(content.extends)
            extendsSet.add('@commitlint/config-conventional')
            content.extends = [...extendsSet.values()]
        }
    }

    content = `module.exports = ${stringify(content, { space: 4 })}`

    fse.writeFileSync(filePath, content, 'utf-8')
    log.info(`✅ ${colors.success('commitlint')} config created`)
}

/**
 * Add commitlint config
 * @returns {any}
 */
function commitizen () {
    const packagePath = findPackageJson()
    const packageContent = fse.readJsonSync(packagePath, { encoding: 'utf-8' })

    if (packageContent.config == null) {
        packageContent.config = {}
    }
    if (packageContent.config.commitizen == null) {
        packageContent.config.commitizen = {}
    }
    packageContent.config.commitizen.path = 'cz-conventional-changelog'

    fse.writeJsonSync(packagePath, packageContent, { spaces: 4, encoding: 'utf-8' })
    log.info(`✅ ${colors.success('commitizen')} config created`)
}

/**
 * Whether automatic installation is required
 * Package manager used in the current project: npm, yarn or pnpm
 * @returns {Promise<{ auto: boolean, manager: 'npm' | 'yarn' | 'pnpm' }>}
 */
function installPrompt () {
    return prompt([
        {
            type: 'toggle',
            name: 'auto',
            message: 'Install the following dependencies now?',
            enabled: 'Yes',
            disabled: 'No',
            initial: 1
        },
        {
            type: 'select',
            name: 'manager',
            message: 'Which package manager are used?',
            choices: ['npm', 'yarn', 'pnpm'],
            skip () {
                return !this.state.answers.auto
            }
        }
    ]).catch(() => {})
}

/**
 * Splice path from filename
 * @param {string[] | string} files
 * @returns {any}
 */
function splicePath (files) {
    files = Array.isArray(files) ? files : [files]
    return files.map(
        filename => path.resolve(cwd, filename)
    )
}

/**
 * check the gitlint peerDependences
 * @returns {void}
 */
async function checkDependencies () {
    const pkgJSONPath = findPackageJson()
    const pkgJSONContent = fse.readJsonSync(pkgJSONPath, { encoding: 'utf-8' })

    const allDependencies = [
        ...Object.keys(pkgJSONContent.devDependencies || {}),
        ...Object.keys(pkgJSONContent.dependencies || {})
    ]

    // find the cross
    const crossDependencies = intersection(allDependencies, needInstallDependencies)
    const isAllInstall = difference(needInstallDependencies, crossDependencies).length === 0

    if (!isAllInstall) {
        const modules = difference(needInstallDependencies, crossDependencies)
        log.info('The following dependencies need to be installed first:')
        log.primary(modules.join(' '))

        const result = await installPrompt()
        if (result && result.auto) {
            const installResult = installSyncSaveDev(modules, result.manager)
            if (!installResult) {
                throw new Error()
            }
        }

        throw new Error(
            'Please manually complete the installation of dependencies'
        )
    }
}

export default async function () {
    try {
        await checkDependencies()
        lintstage()
        commitlint()
        commitizen()
        await husky()
        formatByEslint(splicePath(configFiles.commitlint))
    } catch (error) {
        log.info()
        log.info(error.message)
    }
}
