/**
 * Created by istrauss on 5/31/2016.
 */

import {inject, Container} from 'aurelia-framework';
import ApiClient from './api-client';

@inject(Container)
export default class JsonClient extends ApiClient {

    constructor(container) {
        super(container);
    }

    configure(configurationFn = () => {}) {
        super.configure(config => {
            config
                .withDefaults({
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                });

            configurationFn(config);
        });
    }

    sendAjax(url, fetchParams, options = {}) {
        fetchParams.body = JSON.stringify(fetchParams.body);

        return super.sendAjax(url, fetchParams, options);
    }
}
