/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {Store} from 'aurelia-redux-connect';
import {ModalService, AlertToaster} from 'global-resources';
import {MAX_STELLAR_NUMBER} from '../../../constants';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(ModalService, Store, AlertToaster, TransactionService)
export class TrustService {

    constructor(modalService, store, alertToaster, transactionService) {
        this.modalService = modalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.transactionService = transactionService;
    }

    /**
     * Initiates a trust modification operation
     * @param assetType
     * @param code
     * @param issuer
     * @returns {*}
     */
    async modifyLimit(assetType, code, issuer) {
        if (!this.store.getState().myAccount) {
            const errorMessage = 'You must be logged in to modify trust. Please log in and try again.';
            this.alertToaster.error(errorMessage);
            throw new Error(errorMessage);
        }

        const newTrustlimit = await this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/trust-service/trust-modal/trust-modal'),
            {
                type: assetType,
                code,
                issuer,
                title: 'Modify ' + code + ' Trust Limit'
            }
        );

        return this.submitNewTrustLimit(assetType, code, issuer, newTrustlimit);
    }

    maxOutTrustLimit(assetType, code, issuer) {
        return this.submitNewTrustLimit(
            assetType,
            code,
            issuer,
            MAX_STELLAR_NUMBER.toString()
        );
    }

    submitNewTrustLimit(assetType, code, issuer, trustLimit) {
        const changeTrustOp = StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(code, issuer.accountId || issuer),
            limit: trustLimit
        });

        return this.transactionService.submit([
            changeTrustOp
        ]);
    }
}
