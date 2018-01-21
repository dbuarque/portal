/**
 * Created by istrauss on 5/18/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {Store} from 'aurelia-redux-connect';
import {ModalService, SpinnerModalService, AlertToaster} from 'global-resources';
import {SecretStore} from '../../auth/secret-store/secret-store';
import {TransactionResource} from '../../crud';
import {UpdateMySeqnumActionCreator} from '../../../action-creators';

@inject(ModalService, SpinnerModalService, Store, AlertToaster, SecretStore, TransactionResource, UpdateMySeqnumActionCreator)
export class TransactionService {
    constructor(modalService, spinnerModalService, store, alertToaster, secretStore, transactionResource, udpateMySeqnum) {
        this.modalService = modalService;
        this.spinnerModalService = spinnerModalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
        this.transactionResource = transactionResource;
        this.udpateMySeqnum = udpateMySeqnum;
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

        // Update the account sequence number.
        await this.udpateMySeqnum.dispatch();

        let account = this.store.getState().myAccount;

        if (!account) {
            this.alertToaster.error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
            throw new Error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
        }

        try {
            // Get a transaction builder with the newly obtained account sequence number.
            const transactionBuilder = new StellarSdk.TransactionBuilder(
                new StellarSdk.Account(account.accountId, account.seqNum)
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
        }
        catch (e) {
            this.alertToaster.error('An unexpected error occurred while trying to submit your transaction to the network (perhaps you didn\'t sign the transaction with your secret key?). Your transaction was not submitted to the network.');
            throw e;
        }

        let signedTransaction = this.secretStore.canSign ?
            await this.secretStore.sign(transaction) :
            await this.modalService.open(
                PLATFORM.moduleName('app/resources/stellar/transaction-service/sign-transaction-modal/sign-transaction-modal'),
                {
                    title: 'Sign Transaction',
                    transaction
                },
                {
                    modalClass: 'md'
                }
            );

        try {
            // Finally, attempt to submit the transaction to the network.
            const transactionSubmissionPromise = this.transactionResource.submitTransaction(signedTransaction, {
                handleError: false
            });
            this.spinnerModalService.open('Submitting to network...', transactionSubmissionPromise);
            await transactionSubmissionPromise;
        }
        catch (errResponse) {
            try {
                await this.modalService.open(
                    PLATFORM.moduleName('app/resources/stellar/transaction-service/error-modal/error-modal'),
                    {
                        title: 'Stellar Transaction Error',
                        error: errResponse ? await errResponse.json() : null
                    }, {
                        modalClass: 'sm'
                    }
                );
            }
            catch (e2) {}

            throw e;
        }
    }
}
