/**
* @fileoverview Color for command font
* @author Luoob
*/

import chalk from 'chalk'

/**
 * Paint success color
 * @param {...any} args Content to be colored
 * @returns {string}
 */
function success (...args) {
    return chalk.rgb(0, 180, 42)(...args)
}

/**
 * Paint error color
 * @param {...any} args Content to be colored
 * @returns {string}
 */
function error (...args) {
    return chalk.rgb(245, 63, 63)(...args)
}

/**
 * Paint primary color
 * @param {...any} args Content to be colored
 * @returns {string}
 */
function primary (...args) {
    return chalk.rgb(17, 168, 205)(...args)
}

export {
    success,
    error,
    primary
}
