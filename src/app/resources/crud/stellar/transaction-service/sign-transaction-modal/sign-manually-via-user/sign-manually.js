import {bindable, inject} from 'aurelia-framework';
import {ValidationManager} from 'global-resources';

@inject(ValidationManager)
export class SignManuallyCustomElement {

    rememberExplanation = 'By default, we will not store your secret key at all ' +
        '(after it is used to sign a transaction, it will immediately be forgotten). ' +
        'Checking "Remember Secret" will allow us to store your secret in the browser\'s memory ' +
        'so you can create additional transactions without authenticating again. Even when you select this option, ' +
        'we do not store it anywhere but in the memory of the browser. As soon as you refresh this tab, the secret will be forgotten.';

    constructor(validationManager) {
        this.validationManager = validationManager;
    }

    activate(params) {
        this.modalVM = params.modalVM;
    }

    authenticate() {
        if (!this.validationManager.validate()) {
            return;
        }

        this.modalVM.close({
            secret: this.secret,
            remember: this.remember
        });
    }
}
