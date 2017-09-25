/**
 * Created by istrauss on 5/18/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, AlertToaster} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(StellarServer, ModalService, Store, AlertToaster, SecretStore, AppActionCreators)
export class TransactionService {

    constructor(stellarServer, modalService, store, alertToaster, secretStore, appActionCreators) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
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
            try {
                // Try to update the seqnum
                await this.appActionCreators.updateMySeqnum();
            }
            catch(e) {}

            let account = this.store.getState().myAccount;

            if (!account) {
                this.alertToaster.error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
                throw new Error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
            }

            const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
                new this.stellarServer.sdk.Account(account.accountId, account.seqNum)
            );

            operations.forEach(o => {
                transactionBuilder.addOperation(o);
            });

            if (options.memo) {
                transactionBuilder.addMemo(options.memo);
            }

            transaction = transactionBuilder.build();

            await this.secretStore.sign(transaction);
        }
        catch(e) {
            this.alertToaster.error('An unexpected error occurred while trying to submit your transaction to the network. Your transaction was not submitted.');
            throw e;
        }

        return this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/transaction-service/submit-transaction-modal/submit-transaction-modal'),
            {
                transaction,
                ...options
            },
            {
                modalClass: 'sm submit-transaction',
                dismissible: false
            }
        );
    }
}
