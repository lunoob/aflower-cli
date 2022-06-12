/**
* @fileoverview Example Service Manager
* @author Luoob
*/

import { testHttp } from './http'

class ExampleService {
    /* fetch data */
    public fetch = testHttp('get')('/data')
}

export default new ExampleService()
