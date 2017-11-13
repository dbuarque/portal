import {bindable, inject, computedFrom} from 'aurelia-framework';
import Clipboard from 'clipboard';
import {ValidationManager} from 'global-resources';

@inject(Element, ValidationManager)
export class SignManuallyCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    displayCopySuccess = false;

    @computedFrom('transaction')
    get transactionEnvelopeXDR() {
        return this.transaction.toEnvelope().toXDR('base64');
    }

    constructor(element, validationManager) {
        this.element = element;
        this.validationManager = validationManager;
    }

    attached() {
        const self = this;

        self.$copyButton = $(self.element).find('.copy-label');

        const clipboard = new Clipboard(
            self.$copyButton[0],
            {
                text: () => {
                    return self.transactionEnvelopeXDR
                }
            });

        clipboard
            .on('success', function(e) {
                self.displayCopySuccess = true;

                setTimeout(() => {
                    self.displayCopySuccess = false;
                }, 1500);
            });
    }

    submitToNetwork() {
        if (!this.validationManager.validate()) {
            return;
        }

        const signedTransaction = new Transaction(this.signedTransactionEnvelopeXDR);

        //TODO verify that signedTransaction is the same as transaction (minus the signers)

        this.transactionSigned({
            signedTransaction
        });
    }

}
