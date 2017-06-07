/**
 * Created by istrauss on 5/18/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {StellarServer, ModalService, AlertToaster, AppStore} from 'global-resources';
import {SecretStore} from '../../../auth/secret-store/secret-store';
import {appActionTypes} from '../../../../app-action-types';

const {UPDATE_ACCOUNT} = appActionTypes;

@inject(StellarServer, ModalService, AppStore, AlertToaster, SecretStore)
export class TransactionService {

    constructor(stellarServer, modalService, appStore, alertToaster, secretStore) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
        this.appStore = appStore;
        this.alertToaster = alertToaster;
        this.secretStore = secretStore;
    }

    /**
     *
     * @param operations
     * @param [options]
     * @param [options.memos]
     * @returns {*}
     */
    async submit(operations, options = {}) {
        let account = this.appStore.getState().account;

        if (!account) {
            this.alertToaster.error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
            throw new Error('You cannot submit a transaction to the network without being logged in. Please log in and try again.');
        }

        try {
            account = await this.stellarServer.loadAccount(account.id);

            this.appStore.dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account
                }
            });

            const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
                new this.stellarServer.sdk.Account(account.id, account.sequence)
            );

            operations.forEach(o => {
                transactionBuilder.addOperation(o);
            });

            if (options.memos) {
                options.memos.forEach(m => {
                    transactionBuilder.addMemo(m);
                });
            }

            const transaction = transactionBuilder.build();

            await this.secretStore.sign(transaction);
        }
        catch(e) {
            this.alertToaster.error('An unexpected error occured while trying to submit your transaction to the network. Your transaction was not submitted.');
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
