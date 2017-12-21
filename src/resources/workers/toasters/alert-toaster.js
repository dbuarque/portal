/**
 * Created by istrauss on 10/9/2016.
 */

import {inject} from 'aurelia-framework';
import { MdToastService } from 'aurelia-materialize-bridge';

const defaultOptions = {
    timeout: 15 * 1000
};
const defaultNetworkErrorText = 'Something went wrong. We are having trouble connecting to our server.';

@inject(MdToastService)
export class AlertToaster {
    constructor(toastService) {
        this.toastService = toastService;
    }

    networkError(text = defaultNetworkErrorText, options = {}) {
        if (this._networkToastPromise) {
            return this._networkToastPromise;
        }

        options.type = 'error network-error';
        options.timeout = options.timeout || 60 * 1000;

        this._networkToastPromise = this.toast('<i class="fal fa-lg fa-times-circle"></i>' + text, options)
            .then(() => {
                this._networkToastPromise = undefined;
            });

        return this._networkToastPromise;
    }

    error(text, options = {}) {
        options.type = 'error';
        return this.toast('<i class="fal fa-lg fa-times-circle"></i>' + text, options);
    }

    warning(text, options = {}) {
        options.type = 'warning';
        return this.toast('<i class="fal fa-lg fa-exclamation-circle"></i>' + text, options);
    }

    primary(text, options = {}) {
        options.type = 'primary';
        return this.toast('<i class="fal fa-lg fa-info-circle"></i>' + text, options);
    }

    info(text, options = {}) {
        options.type = 'info';
        return this.toast('<i class="fal fa-lg fa-info-circle"></i>' + text, options);
    }

    success(text, options = {}) {
        options.type = 'success';
        return this.toast('<i class="fal fa-lg fa-success-circle"></i>' + text, options);
    }

    toast(text, options) {
        const _options = {
            ...defaultOptions,
            ...options
        };

        return this.toastService.show(text, _options.timeout, _options.type);
    }
}
