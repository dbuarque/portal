/**
 * Created by istrauss on 5/25/2016.
 */

import {inject} from 'aurelia-framework';
import {AlertToaster} from '../workers/alert-toaster/alert-toaster';

const defaultErrors = {
    default: {
        messageType: 'error',
        message: 'We are experiencing issues. Please contact support.'
    },
    401: {
        messageType: 'warning',
        message: 'Unauthorized. Please login and try again.'
    },
    403: {
        messageType: 'warning',
        message: 'You don\'t have permission to access that resource.'
    },
    502: {
        messageType: 'error',
        message: 'We had issues connecting to our server. Please check your internet connection and try again. If this problem persists, please contact support.'
    }
};

@inject(AlertToaster)
export default class HttpErrorHandler {

    constructor(alertToaster) {
        this.alertToaster = alertToaster;
    }

    async handleResponse(response) {
        const interpretation = await this.interpretResponse(response);
        this.alertToaster[interpretation.messageType](interpretation.message);
        return Promise.reject(interpretation);
    }

    async interpretResponse(response) {
        if (!response) {
            return {
                ...defaultErrors.default,
                response
            };
        }
        
        const err = await (response.json ? response.json() : {});
        const defaultErr = defaultErrors[response.status] || defaultErrors.default;
        
        return {
            ...defaultErr,
            ...err,
            response
        };
    }
}
