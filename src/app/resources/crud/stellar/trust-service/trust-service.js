/**
 * Created by istrauss on 5/8/2017.
 */

import _find from 'lodash.find';
import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, AlertToaster} from 'global-resources';
import {TransactionService} from '../transaction-service/transaction-service';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(StellarServer, ModalService, Store, AlertToaster, TransactionService, AppActionCreators)
export class TrustService {

    constructor(stellarServer, modalService, store, alertToaster, transactionService, appActionCreators) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.transactionService = transactionService;
        this.appActionCreators = appActionCreators;
    }

    /**
     * Initiates a trust modification operation
     * @param code
     * @param issuer
     * @returns {*}
     */
    async modifyLimit(code, issuer) {
        if (!this.store.getState().myAccount) {
            const errorMessage = 'You must be logged in to modify trust. Please log in and try again.';
            this.alertToaster.error(errorMessage);
            throw new Error(errorMessage);
        }

        const operations = await this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/trust-service/trust-modal/trust-modal'),
            {
                code,
                issuer,
                title: 'Modify ' + code + ' Trust Limit'
            }
        );

        await this.transactionService.submit(operations);
    }
}
