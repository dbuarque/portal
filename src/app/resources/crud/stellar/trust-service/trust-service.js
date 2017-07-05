/**
 * Created by istrauss on 5/8/2017.
 */

import _find from 'lodash.find';
import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {StellarServer, ModalService, AppStore, AlertToaster} from 'global-resources';
import {TransactionService} from '../transaction-service/transaction-service';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(StellarServer, ModalService, AppStore, AlertToaster, TransactionService, AppActionCreators)
export class TrustService {

    constructor(stellarServer, modalService, appStore, alertToaster, transactionService, appActionCreators) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
        this.appStore = appStore;
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
        if (!this.appStore.getState().account) {
            const errorMessage = 'You must be logged in to send a payment. Please log in and try again.';
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

        await this.appStore.dispatch(this.appActionCreators.updateAccount());
    }

    //minimumTrustLimit(code, issuer) {
    //    const balance = this.balance(code, issuer);
    //    return Math.ceil(parseFloat(this.buyingAssetBalance, 10) + parseFloat(this.buyingAmount, 10) + this.buyingAssetOffersAmount);
    //}

    balance(code, issuer) {
        const account = this.appStore.getState().account;

        if (!account || !account.balances) {
            return undefined;
        }

        return _find(account.balances, b => code === window.lupoex.stellar.nativeAssetCode ? b.asset_type === 'native' : b.asset_code === code && b.asset_issuer === issuer);
    }

    //buyingAssetOffersAmount() {
    //    const offers = this.appStore.getState().offers;
    //
    //    if (!offers) {
    //        return 0;
    //    }
    //
    //    return offers ? offers.reduce((result, o) => {
    //        const add = asset1.asset_code === asset2.code && asset1.asset_issuer === asset2.issuer ?
    //        parseFloat(o.amount, 10) * parseFloat(o.price, 10) :
    //            parseFloat(o.amount, 10);
//
    //        return result + add;
    //    }, 0) : 0;
    //}
}
