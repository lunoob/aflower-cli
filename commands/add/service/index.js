/**
* @fileoverview Service config module
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
 * Copy the service configuration file to the target location
 * @param {string} position
 * @returns {void}
 */
function copyService (position) {
    const servicePath = path.resolve(position, 'services')
    fse.ensureDirSync(servicePath)

    const { __dirname } = getPath(import.meta.url)
    try {
        fse.copySync(path.resolve(__dirname, 'source'), servicePath, {
            overwrite: false,
            errorOnExist: true
        })
    } catch (error) {
        if (error.message.includes('already exists')) {
            log.error('An error occurred: Services folder is exists')
        }
    }
}

/**
 * Execute completion Callback
 * @returns {void}
 */
function runDone () {
    log.success('✅ Services folder is created')
}

export default function () {
    const isSrcExist = checkIsSrcDirExist()
    copyService(isSrcExist ? Position.SRC : Position.ROOT)
    runDone()
}
