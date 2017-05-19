/**
 * Created by istrauss on 5/18/2017.
 */

import {inject} from 'aurelia-framework';
import {StellarServer} from 'global-resources';

const defaultSuccessMessage = 'Your transaction was successful.';

@inject(StellarServer)
export class SubmitTransactionModal {

    loading = 1;

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    activate(params) {
        this.modalVM = params.modalVM;
        this.transaction = params.passedInfo.transaction;
        this.tryAgain = params.passedInfo.tryAgain;
        this.submitAnother = params.passedInfo.submitAnother;
        this.finish = params.passedInfo.finish;
        this.onSuccess = params.passedInfo.onSuccess;

        this.submitTransaction();
    }

    async submitTransaction() {
        this.modalVM.options.dismissible = false;

        let transactionResponse;

        try {
            transactionResponse = await this.stellarServer.submitTransaction(this.transaction);
        }
        catch(e) {
            if (e.message) {
                this.errorMessage = e.message;
            }
            else if (e.extras) {
                this.errorMessage = Object.values(e.extras.result_codes).join(', ');
            }
            else {
                this.errorMessage = 'An unknown error has occured in submitting your transaction to the network.';
            }

            this.step = 'failure';
            this.loading--;
            this.modalVM.options.dismissible = true;

            return;
        }

        if (this.onSuccess) {
            try {
                this.successMessage = await this.onSuccess(transactionResponse)
            }
            catch(e) {}
        }

        this.successMessage = this.successMessage || defaultSuccessMessage;

        this.step = 'success';
        this.loading--;
        this.modalVM.options.dismissible = true;
    }

    _finish() {
        this.modalVM.close();
        this.finish.callback();
    }

    _tryAgain() {
        this.modalVM.close();
        this.tryAgain.callback();
    }

    _submitAnother() {
        this.modalVM.close();
        this.submitAnother.callback();
    }
}
