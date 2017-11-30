/**
 * Created by istrauss on 5/31/2016.
 */

import _find from 'lodash/find';
import {inject, Container} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import HttpErrorHandler from '../http-error-handler';

@inject(Container)
export default class ApiClient extends HttpClient {
    constructor(container) {
        super();

        this.httpErrorHandler = container.get(HttpErrorHandler);
    }

    configure(configurationFn = () => {}) {
        super.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(window.lupoex.urls.api);

            configurationFn(config);
        });
    }

    sendAjax(url, fetchParams, options = {}) {
        let query = _createQueryString(options.query);
        return this.fetch(url + (query || ''), fetchParams)
            .catch(response => {
                if (options.handleError === false) {
                    throw response;
                }
                return this.httpErrorHandler.handleResponse(response);
            })
            .then(response => {
                let contentType = response.headers.get('Content-Type');
                let contentDisposition = response.headers.get('Content-Disposition');
                let fileNameHeaderValue = contentDisposition ? _find(contentDisposition.split(';'), headerValue => headerValue.indexOf('filename=') > -1) : null;
                let fileName = fileNameHeaderValue ? fileNameHeaderValue.slice(fileNameHeaderValue.indexOf('=') + 1) : null;

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json();
                }

                if (fileName) {
                    return response.blob()
                        .then(blob => {
                            blob.name = fileName;
                            return blob;
                        });
                }

                return response;
            });
    }
}

function _createQueryString(params = {}) {
    Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
            delete params[key];
        }
        if (params[key] === null) {
            params[key] = 'null';
        }
    });

    return Object.keys(params).length > 0 ? '?' + Object.keys(params).map(k => k + '=' + params[k]).join('&') : '';
}
