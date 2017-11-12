import {bindable, inject} from 'aurelia-framework';
import Clipboard from 'clipboard';
import {ValidationManager} from 'global-resources';

@inject(Element, ValidationManager)
export class SignManuallyCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    constructor(element, validationManager) {
        this.element;
        this.validationManager = validationManager;
    }

    activate(params) {
        this.modalVM = params.modalVM;
    }

    attached() {
        const clipboard = new Clipboard($(this.element.find('button')));
    }

    authenticate() {
        if (!this.validationManager.validate()) {
            return;
        }
    }
}
