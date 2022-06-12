/**
* @fileoverview Http requestor
* @author Luoob
*/

import axios from 'axios'
import { successHandler, errorHandler } from './handlers'
import { curry } from 'lodash-es'
import { carryParams } from './tool'

export type Method =
    | 'get'
    | 'GET'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'delete'
    | 'DELETE'

export interface XhrParams {
    url: string
    method: Method
    params: any
}

export interface IResponse {
    status: number
    message?: string
    data: any
}

interface HttpInsOption {
    baseUrl: string
    prefix?: string
    timeout?: number
}

type MethodType = (
    method: Method,
    url: string,
    params: any
) => Promise<IResponse>

/**
 * Create http request instance
 * @param {HttpInsOption} option:
 * @returns {Object}
 */
const createHttpIns = (option: HttpInsOption) => {
    const instance = axios.create({
        baseURL: option.baseUrl.replace(/\/$/, '') + (option.prefix || ''),
        timeout: 30 * 1000
    })

    const http = ({ url, params, method = 'get' }: XhrParams): Promise<IResponse> => {
        const useBody = ['post', 'put'].includes(method.toLocaleLowerCase())

        return instance({
            url,
            method,
            params: useBody ? undefined : carryParams(params),
            data: useBody ? carryParams(params) : undefined
        })
            .then(successHandler)
            .catch(errorHandler)
    }

    return {
        instance,
        http
    }
}

/**
 * Create Requestor
 * @param {HttpInsOption} option
 * @returns {Object}
 */
export const createRequest = (option: HttpInsOption) => {
    const { instance, http } = createHttpIns(option)

    const createRequestMethod: MethodType = (method, url, params) => http({ url, method, params })

    return {
        getInstance: () => instance,
        request: curry(createRequestMethod)
    }
}
