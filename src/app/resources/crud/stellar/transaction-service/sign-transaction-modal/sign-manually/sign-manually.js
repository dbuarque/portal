import {bindable, inject} from 'aurelia-framework';
import {ValidationManager} from 'global-resources';

@inject(ValidationManager)
export class SignManuallyCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

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
    }
}
