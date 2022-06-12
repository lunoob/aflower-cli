/**
* @fileoverview Http requestor instance
* @author Luoob
*/

import { createRequest } from './create'

// Test http instance
export const testHttp = createRequest({
    baseUrl: '/'
}).request
