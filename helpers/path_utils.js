/**
* @fileoverview Utility for file system
* @author Luoob
*/

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import path from 'path'
import url from 'url'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Simulate __filename, __dirname
 * @param {string} url
 * @returns {{ __filename: string, __dirname: string }}
 */
const getPath = (urlPath) => {
    const __filename = url.fileURLToPath(urlPath)
    const __dirname = path.dirname(__filename)
    return { __filename, __dirname }
}

export {
    getPath
}
