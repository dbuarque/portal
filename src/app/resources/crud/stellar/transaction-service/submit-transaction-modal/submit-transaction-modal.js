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
        this.onSuccess = params.passedInfo.onSuccess;
        this.onFailure = params.passedInfo.onFailure;

        this.submitTransaction();
    }

    async submitTransaction() {
        let transactionResponse;

        try {
            transactionResponse = await this.stellarServer.submitTransaction(this.transaction);
        }
        catch(e) {
            if (this.onFailure) {
                try {
                    this.errorMessage = await this.onFailure(e)
                }
                catch(e) {}

                if (this.errorMessage === false) {
                    this.modalVM.dismiss(e);
                    return;
                }
            }

            else if (e.message) {
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

            if (this.successMessage === false) {
                this.modalVM.close();
                return;
            }
        }

        this.successMessage = this.successMessage || defaultSuccessMessage;

        this.step = 'success';
        this.loading--;
    }

    finish() {
        this.modalVM.close();
    }
}
