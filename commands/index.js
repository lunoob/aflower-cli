/**
* @fileoverview Unified export modules
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import Add from './add/index.js'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Execute a command that does not exist or is incorrect
 * @param {any} command command name
 * @param {any} args    command arguments
 * @returns {() => void}
 */
function Fail (command, args) {
    return () => {
        console.log(`${command} option is not exist`)
        console.log('Run "aflower --help" for more info')
    }
}

export {
    Add,
    Fail
}
