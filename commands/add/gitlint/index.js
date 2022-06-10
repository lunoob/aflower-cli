const path = require('path')
const fse = require('fs-extra')
const { exec } = require('child_process')
const { intersection, difference } = require('lodash')

const needInstallDependencies = [
    'commitizen',
    'husky',
    'lint-staged',
    '@commitlint/config-conventional'
]

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
    const package = require(filePath)

    if (package.config == null) {
        package.config = {}
    }
    if (package.config.commitizen == null) {
        package.config.commitizen = {}
    }
    package.config.commitizen.path = 'cz-conventional-changelog'

    fse.writeJsonSync(filePath, package, { spaces: 4 })
    console.log('commitizen - config created\n')
}

// checkDependencies
function checkDependencies () {
    // 获取进程工作区
    const basePath = process.cwd()
    // 获取 package.json 内容
    const packageJson = require(path.resolve(basePath, 'package.json'))

    const allDependencies = [
        ...Object.keys(packageJson.devDependencies),
        ...Object.keys(packageJson.dependencies)
    ]

    // 交集
    const crossDependencies = intersection(allDependencies, needInstallDependencies)
    const isAllInstall = difference(crossDependencies, needInstallDependencies).length === 0

    if (!isAllInstall) {
        // 暂时先不开启新的进程去自动安装
        // 直接提示安装, 提示安装缺少的依赖
        const missDependencies = difference(needInstallDependencies, crossDependencies)
        console.log('The following dependencies need to be installed first:')
        return console.log(missDependencies.join(' '))
    }
}

module.exports = async function () {
    checkDependencies()

    try {
        lintstage()
        commitlint()
        commitizen()
        husky()
    } catch (error) {
        console.log('occur error: ', error.message)
    }
}
