/**
* @fileoverview Format file rule by lint tool
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import spawn from 'cross-spawn'
import * as log from './logging.js'

// ------------------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------------------

/**
 * Use
 * @param {string[] | string} filePaths
 * @returns {void}
 */
function formatByEslint (filePaths) {
    filePaths = Array.isArray(filePaths) ? filePaths : [filePaths]

    const result = spawn.sync('npx', ['eslint', '--fix', '--quiet'].concat(filePaths), { encoding: 'utf-8' })

    if (result.error || result.status !== 0) {
        log.error('config file was generated, but the config file itself may not follow your linting rules.')
    }
}

export {
    formatByEslint
}
