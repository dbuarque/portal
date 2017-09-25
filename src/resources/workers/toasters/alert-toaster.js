/**
 * Created by istrauss on 10/9/2016.
 */

import _throttle from 'lodash.throttle';
import {inject, bindable} from 'aurelia-framework';
import { MdToastService } from 'aurelia-materialize-bridge';

const defaultOptions = {
    timeout: 10 * 1000
};
const defaultNetworkErrorText = 'Something went wrong. We are having trouble connecting to our server.';

@inject(MdToastService)
export class AlertToaster {

    constructor(toastService) {
        this.toastService = toastService;

        this.networkError = _throttle((text = defaultNetworkErrorText) => {
            this.error(text, {
                timeout: 60 * 1000
            });
        }, 60 * 1000);
    }

    error(text, options = {}) {
        options.type = 'error';
        this.toast(text, options);
    }

    warning(text, options = {}) {
        options.type = 'warning';
        this.toast(text, options);
    }

    primary(text, options = {}) {
        options.type = 'primary';
        this.toast(text, options);
    }

    info(text, options = {}) {
        options.type = 'info';
        this.toast(text, options);
    }

    success(text, options = {}) {
        options.type = 'success';
        this.toast(text, options);
    }

    toast(text, options) {
        const _options = {
            ...defaultOptions,
            ...options
        };
        this.toastService.show(text, _options.timeout, _options.type);
    }
}
