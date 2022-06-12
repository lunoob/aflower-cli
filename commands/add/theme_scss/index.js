/**
* @fileoverview Theme config module by Scss
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import path from 'path'
import fse from 'fs-extra'
import { getPath } from '../../../helpers/path_utils.js'
import * as log from '../../../helpers/logging.js'

const cwd = process.cwd()
const Position = {
    SRC: path.resolve(cwd, 'src'),
    ROOT: cwd
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check whether the SRC directory exists
 * @param {string} directory Project directory path. default: process.cwd()
 * @returns {boolean}
 */
function checkIsSrcDirExist (directory = cwd) {
    const isExist = fse.existsSync(Position.SRC)

    if (isExist) {
        return fse.statSync(Position.SRC).isDirectory()
    }

    return isExist
}

/**
 * Copy the theme configuration file to the target location
 * @param {string} position
 * @returns {void}
 */
function copyTheme (position) {
    const themePath = path.resolve(position, 'theme')
    fse.ensureDirSync(themePath)

    const { __dirname } = getPath(import.meta.url)
    try {
        fse.copySync(path.resolve(__dirname, 'source'), themePath, {
            overwrite: false,
            errorOnExist: true
        })
    } catch (error) {
        if (error.message.includes('already exists')) {
            log.error('An error occurred: Theme folder is exists')
        }
    }
}

/**
 * Execute completion Callback
 * @returns {void}
 */
function runDone () {
    log.success('✅ Theme folder is created')
}

export default function () {
    const isSrcExist = checkIsSrcDirExist()
    copyTheme(isSrcExist ? Position.SRC : Position.ROOT)
    runDone()
}
