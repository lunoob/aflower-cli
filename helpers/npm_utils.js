/**
* @fileoverview Utility for executing npm commands.
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import path from 'path'
import fs from 'fs'
import spawn from 'cross-spawn'
import * as log from './logging.js'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Find the closest package.json file, starting at process.cwd (by default),
 * and working up to root.
 * @param {string} [startDir=process.cwd()] Starting directory
 * @returns {string} Absolute path to closest package.json file
 */
function findPackageJson (startDir) {
    let dir = path.resolve(startDir || process.cwd())

    do {
        const pkgFile = path.join(dir, 'package.json')

        if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
            dir = path.join(dir, '..')
            continue
        }
        return pkgFile
    } while (dir !== path.resolve(dir, '..'))
    return null
}

/**
 * Install node modules synchronously and save to devDependencies in package.json
 * @param {string|string[]} packages Node module or modules to install
 * @param {string} packageManager Package manager to use for installation.(default: npm)
 * @returns {boolean}
 */
function installSyncSaveDev (packages, packageManager = 'npm') {
    const packageList = Array.isArray(packages) ? packages : [packages]
    const installCmd = packageManager === 'npm' ? 'install' : 'add'
    const installProcess = spawn.sync(
        packageManager,
        [installCmd, '-D'].concat(packageList),
        { stdio: 'inherit' }
    )
    const wrong = installProcess.error

    if (wrong && wrong.code === 'ENOENT') {
        const pluralS = packageList.length > 1 ? 's' : ''

        log.error(`Could not execute ${packageManager}. Please install the following package${pluralS} with a package manager of your choice: \n${packageList.join(', ')}`)

        return false
    }

    return true
}

export {
    installSyncSaveDev,
    findPackageJson
}
