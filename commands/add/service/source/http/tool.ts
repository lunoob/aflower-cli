/**
* @fileoverview Utility for http
* @author Luoob
*/

import { isPlainObject } from 'lodash-es'

/**
 * Add additional parameters to the request parameters globally
 * @param {any} params
 * @returns {Object}
 */
export function carryParams (params: any) {
    if (!isPlainObject(params)) {
        return params
    }

    return {
        author: 'Luoob',
        ...params
    }
}
