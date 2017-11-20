import {bindable, inject, computedFrom} from 'aurelia-framework';
import Clipboard from 'clipboard';
import * as StellarSdk from 'stellar-sdk';

@inject(Element)
export class SignManuallyCustomElement {

    @bindable() transactionSigned;
    @bindable() transaction;
    @bindable() back;

    displayCopySuccess = false;

    @computedFrom('transaction')
    get transactionEnvelopeXDR() {
        return this.transaction.toEnvelope().toXDR('base64');
    }

    constructor(element) {
        this.element = element;
    }

    attached() {
        const self = this;

        self.$copyButton = $(self.element).find('.copy-label');

        const clipboard = new Clipboard(
            self.$copyButton[0],
            {
                text: () => {
                    return self.transactionEnvelopeXDR;
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
        let signedTransaction;
        try {
            signedTransaction = new StellarSdk.Transaction(this.signedTransactionEnvelopeXDR);
        }
        catch (e) {
            this.errorMessage = 'The input signed transaction is not a valid stellar transaction.';
            return;
        }

        if (
            !this.compareHashes(
                this.transaction.hash(),
                signedTransaction.hash()
            )
        ) {
            this.errorMessage = 'The input signed transaction is not the same as the original transaction.';
            return;
        }

        this.transactionSigned({
            signedTransaction
        });
    }

    compareHashes(hash1, hash2) {
        return hash1.length === hash2.length && hash1.reduce((result, hash1Byte, index) => {
            return result && hash1Byte === hash2[index];
        }, true);
    }
}
