/**
 * @fileoverview Handle logging
 * @author Luoob
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const chalk = require('chalk')

// ------------------------------------------------------------------------------
// Utilies
// ------------------------------------------------------------------------------

/**
 * Cover for console.log
 * @param {...any} args The elements to log.
 * @returns {void}
 */
function info (...args) {
    console.log(...args)
}

/**
 * highlight log
 * @param {...any} args The elements to log.
 * @returns {void}
 */
function light (...args) {
    console.log(chalk.rgb(17, 168, 205)(...args))
}

/**
 * Cover for console.error
 * @param {...any} args The elements to log.
 * @returns {void}
 */
function error (...args) {
    console.error(...args)
}

module.exports = {
    info,
    error,
    light
}
