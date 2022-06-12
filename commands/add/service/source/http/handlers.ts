/**
* @fileoverview Request or Response Interceptor
* @author Luoob
*/

/**
 * Successful response interceptor
 * @param {any} response
 * @returns {Object}
 */
const successHandler = (response: any) => {
    const data = response.data
    return {
        status: data.status || response.status,
        message: data.message,
        data: data.data
    }
}

/**
* Failure, error response interceptor
* @param {any} wrong
* @returns {Object}
*/
const errorHandler = (wrong: any) => {
    const url = wrong.config.url
    const message = wrong.message

    console.error(
        `api# ${url} - ${message}`
    )
    return {
        status: -1,
        message: 'Api request failed, please try again',
        data: ''
    }
}

export { successHandler, errorHandler }
