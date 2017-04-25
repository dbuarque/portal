/**
 * Created by istrauss on 3/23/2016.
 */

import {AlertModalService} from 'global-resources';

export default class BaseResource {
    constructor(container, config) {
        this.config = config;
    }

    get(action, query, options = {}) {
        options.query = query;
        return this.sendAjax(action, {}, options);
    }

    post(action, query, body, options = {}) {
        options.query = query;
        return this.sendAjax(action, {
            method: 'post',
            body
        }, options);
    }

    sendAjax(action, fetchParams, options = {}) {
        const client = options.client || this.config.client;
        return client.sendAjax((this.config.resourceUrl || '') + (action || ''), fetchParams, options);
    }

    get validationInstructions() {
        throw new Error('getValidationInstructions is not implemented');
    }
}
