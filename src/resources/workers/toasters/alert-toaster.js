/**
 * Created by istrauss on 10/9/2016.
 */

const defaultOptions = {
    timeout: 15 * 1000
};
const defaultNetworkErrorText = 'Something went wrong. We are having trouble connecting to our server.';

export class AlertToaster {

    networkError(text = defaultNetworkErrorText, options = {}) {
        options.type = 'error network-error';
        options.timeout = options.timeout || 30 * 1000;

        $('#toast-container').find('.network-error').each((i, elm) => {
             $(elm).first()[0].M_Toast.remove();
        });

       this.toast(text, options);
    }

    error(text, options = {}) {
        options.type = 'error';
        return this.toast(text, options);
    }

    warning(text, options = {}) {
        options.type = 'warning';
        return this.toast(text, options);
    }

    primary(text, options = {}) {
        options.type = 'primary';
        return this.toast(text, options);
    }

    info(text, options = {}) {
        options.type = 'info';
        return this.toast(text, options);
    }

    success(text, options = {}) {
        options.type = 'success';
        return this.toast(text, options);
    }

    toast(text, options) {
        const _options = {
            ...defaultOptions,
            ...options
        };

        return Materialize.toast(text, _options.timeout, _options.type);
    }
}
