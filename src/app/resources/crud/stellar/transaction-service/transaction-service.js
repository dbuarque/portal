/**
 * Created by istrauss on 5/18/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, SpinnerModalService, AlertToaster} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(StellarServer, ModalService, SpinnerModalService, Store, AlertToaster, SecretStore, AppActionCreators)
export class TransactionService {

    constructor(stellarServer, modalService, spinnerModalService, store, alertToaster, secretStore, appActionCreators) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
        this.spinnerModalService = spinnerModalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
        this.appActionCreators = appActionCreators;
    }

    /**
     *
     * @param operations
     * @param [options]
     * @param [options.memo]
     * @returns {*}
     */
    async submit(operations, options = {}) {
        let transaction;

        try {
            // Update the account sequence number.
            await this.appActionCreators.updateMySeqnum();

            let account = this.store.getState().myAccount;

            if (!account) {
                this.alertToaster.error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
                throw new Error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
            }

            // Get a transaction builder with the newly obtained account sequence number.
            const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
                new this.stellarServer.sdk.Account(account.accountId, account.seqNum)
            );

            // Add the operations to the transaction.
            operations.forEach(o => {
                transactionBuilder.addOperation(o);
            });

            // Add the optional memo to the transaction.
            if (options.memo) {
                transactionBuilder.addMemo(options.memo);
            }

            // Build the transaction
            transaction = transactionBuilder.build();

            // Delegate the actual signing of the transaction to the secretStore (which will prompt the user for their secret key if it does not yet have it).
            await this.secretStore.sign(transaction);
        }
        catch(e) {
            this.alertToaster.error('An unexpected error occurred while trying to submit your transaction to the network (perhaps you didn\'t sign the transaction with your secret key?). Your transaction was not submitted to the network.');
            throw e;
        }

        let transactionResponse;

        try {
            // Finally, attempt to submit the transaction to the network.
            const transactionSubmissionPromise = this.stellarServer.submitTransaction(transaction);
            this.spinnerModalService.open('Submitting to network...', transactionSubmissionPromise);
            await transactionSubmissionPromise;
        }
        catch(e) {
            let errorMessage;

            if (e.message) {
                errorMessage = e.message;
            }
            else if (e.extras) {
                errorMessage = 'There was an error in submitting the transaction to the stellar network. The transaction failed with the following code(s):<br>' + Object.values(e.extras.result_codes).join(', ');
            }
            else {
                errorMessage = 'An unknown error occurred in submitting your transaction to the stellar network. The transaction was not executed.';
            }

            try {
                this.modalService.open('app/resources/crud/stellar/transaction-service/error-modal/error-modal', {
                    title: 'Stellar Transaction Error',
                    message: errorMessage
                });
            }
            catch(e) {}

            throw e;
        }
    }
}
