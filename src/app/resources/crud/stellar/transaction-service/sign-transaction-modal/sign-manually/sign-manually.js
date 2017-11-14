import {bindable, inject, computedFrom} from 'aurelia-framework';
import Clipboard from 'clipboard';
import {ValidationManager, RequiredValidator, StellarServer} from 'global-resources';

@inject(Element, ValidationManager, StellarServer)
export class SignManuallyCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    displayCopySuccess = false;

    @computedFrom('transaction')
    get transactionEnvelopeXDR() {
        return this.transaction.toEnvelope().toXDR('base64');
    }

    constructor(element, validationManager, stellarServer) {
        this.element = element;
        this.validationManager = validationManager;
        this.stellarServer = stellarServer;

        const self = this;

        self.validationManager.addInstructions([
            {
                key: 'signedTransactionEnvelopeXDR',
                title: 'Signed Transaction',
                validators: [
                    new RequiredValidator(),
                    {
                        message: '@title is not a valid stellar transaction',
                        validate(value) {
                            let signedTransaction;
                            try {
                                signedTransaction = new self.stellarServer.sdk.Transaction(value);
                            }
                            catch(e) {}

                            return !!signedTransaction;
                        }
                    },
                    {
                        message: '@title is not the same as the original transaction',
                        validate(value) {
                            const signedTransaction = new self.stellarServer.sdk.Transaction(value);
                            return self.transaction.hash() === signedTransaction.hash();
                        }
                    }
                ]
            }
        ])
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

        this.transactionSigned({
            signedTransaction: new this.stellarServer.sdk.Transaction(this.signedTransactionEnvelopeXDR)
        });
    }

}
