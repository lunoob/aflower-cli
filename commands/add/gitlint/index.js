/**
* @fileoverview gitlint config module
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const path = require('path')
const fse = require('fs-extra')
const { exec } = require('child_process')
const { intersection, difference } = require('lodash')
const { findPackageJson, installSyncSaveDev } = require('../../../helpers/npm_utils')
const { info, light } = require('../../../helpers/logging')
const { prompt } = require('enquirer')

// ------------------------------------------------------------------------------
// Variables
// ------------------------------------------------------------------------------

const needInstallDependencies = [
    'commitizen',
    'husky',
    'lint-staged',
    '@commitlint/config-conventional'
]

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// husky
function husky () {
    // 1. 增加 npm script 命令 "prepare": "husky install"
    // 2. 增加 husky 钩子
    const commands = [
        'npm set-script prepare "husky install"',
        'npm set-script cz "git-cz"',
        'npm set-script check "lint-staged"',
        'npx husky install',
        'npx husky add .husky/pre-commit "npm run check"',
        'npx husky add .husky/commit-msg "npx commitlint -e"'
    ]
    return new Promise((resolve, reject) => {
        const subprocess = exec(commands.join(' && '))

        subprocess.stdout?.on('data', data => {
            console.log(data)
        })

        subprocess.stderr?.on('data', data => {
            reject(data)
        })

        subprocess.on('exit', () => {
            resolve('')
        })
    })
}

// lintstage
function lintstage () {
    // 先判断是否存在这个文件
    const filePath = path.resolve(process.cwd(), '.lintstagedrc.json')
    fse.ensureFileSync(filePath)

    let content = ''
    try {
        content = fse.readJsonSync(filePath)
    } catch {
        content = {}
    }
    // @ts-ignore
    content['*.{js,ts}'] = ['eslint --fix']

    fse.writeJsonSync(filePath, content, { spaces: 4 })
    console.log('lintstaged - config created\n')
}

// commitlint
async function commitlint () {
    // 先判断是否存在这个文件
    const filePath = path.resolve(process.cwd(), 'commitlint.config.js')
    fse.ensureFileSync(filePath)

    const module = 'module.exports = '
    let content = ''

    try {
        content = require(filePath)
    } catch {
        console.log('error')
    }

    const isEmpty = Object.keys(content).length === 0

    if (isEmpty) {
        content = module
        const config = {
            extends: ['@commitlint/config-conventional']
        }
        content += JSON.stringify(config)
    } else {
        // 判断 extends 是否存在
        if (content.extends != null) {
            const extendsSet = new Set(content.extends)
            extendsSet.add('@commitlint/config-conventional')
            content.extends = [...extendsSet.values()]
        }
        content = module + JSON.stringify(content)
    }

    fse.writeFileSync(filePath, content, 'utf-8')
    console.log('commitlint - config created\n')
}

// commitizen
function commitizen () {
    const filePath = path.resolve(process.cwd(), 'package.json')
    const pkg = require(filePath)

    if (pkg.config == null) {
        pkg.config = {}
    }
    if (pkg.config.commitizen == null) {
        pkg.config.commitizen = {}
    }
    pkg.config.commitizen.path = 'cz-conventional-changelog'

    fse.writeJsonSync(filePath, pkg, { spaces: 4 })
    console.log('commitizen - config created\n')
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
 * check the gitlint peerDependences
 * @returns {void}
 */
async function checkDependencies () {
    const pkgJSONPath = findPackageJson()
    const pkgJSONContent = fse.readJsonSync(pkgJSONPath, { encoding: 'utf8' })

    const allDependencies = [
        ...Object.keys(pkgJSONContent.devDependencies || {}),
        ...Object.keys(pkgJSONContent.dependencies || {})
    ]

    // find the cross
    const crossDependencies = intersection(allDependencies, needInstallDependencies)
    const isAllInstall = difference(needInstallDependencies, crossDependencies).length === 0

    if (!isAllInstall) {
        const modules = difference(needInstallDependencies, crossDependencies)
        info('The following dependencies need to be installed first:')
        light(modules.join(' '))

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

module.exports = async function () {
    try {
        await checkDependencies()
        lintstage()
        commitlint()
        commitizen()
        husky()
    } catch (error) {
        info()
        info(error.message)
    }
}
