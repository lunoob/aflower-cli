/**
 * @fileoverview Handle logging
 * @author Luoob
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import * as colors from './colors.js'

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
function primary (...args) {
    console.log(colors.primary(...args))
}

/**
 * Cover for console.error
 * @param {...any} args The elements to log.
 * @returns {void}
 */
function error (...args) {
    console.log(colors.error(...args))
}

/**
 * success log
 * @param {...any} args The elements to log.
 * @returns {void}
 */
function success (...args) {
    console.log(colors.success(...args))
}

export {
    info,
    error,
    primary,
    success
}
