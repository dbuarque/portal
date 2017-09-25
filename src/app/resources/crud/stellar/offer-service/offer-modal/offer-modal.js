/**
 * Created by istrauss on 5/8/2017.
 */

import BigNumber from 'bignumber.js';
import _find from 'lodash.find';
import {inject} from 'aurelia-framework'
import {Store} from 'au-redux';
import {StellarServer, AlertToaster} from 'global-resources';
import {LupoexResource, validStellarNumber} from 'app-resources';
import {AppActionCreators} from '../../../../../app-action-creators';

@inject(StellarServer, Store, AlertToaster, LupoexResource, AppActionCreators)
export class OfferModal {

    loading = 0;

    get buyingAmount() {
        return (new BigNumber(this.sellingAmount)).dividedBy(this.price).toString(10);
    }

    //get fee() {
    //    if (window.lupoex.env !== 'production') {
    //        return 0;
    //    }
//
    //    return (new BigNumber(this.sellingAmount)).times(window.lupoex.offerFeeFactor).toFixed(7);
    //}

    constructor(stellarServer, store, alertToaster, lupoexResource, appActionCreators) {
        this.stellarServer = stellarServer;
        this.store = store;
        this.alertToaster = alertToaster;
        this.lupoexResource = lupoexResource;
        this.appActionCreators = appActionCreators;
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.modalVM = params.modalVM;
        //type should be 'Bid' or 'Ask'
        this.type = params.passedInfo.type || 'bid';
        this.sellingCode = params.passedInfo.sellingCode;
        this.sellingIssuer = params.passedInfo.sellingIssuer;
        this.sellingAmount = params.passedInfo.sellingAmount;
        this.buyingCode = params.passedInfo.buyingCode;
        this.buyingIssuer = params.passedInfo.buyingIssuer;
        this.price = params.passedInfo.price;
    }

    async confirm() {
        this.modalVM.dismissible = false;

        let sellingAmount = new BigNumber(this.sellingAmount);
        //sellingAmount = sellingAmount.minus(this.fee).toFixed(7);

        const sellingAsset = this.sellingCode === this.nativeAssetCode ?
            this.stellarServer.sdk.Asset.native() :
            new this.stellarServer.sdk.Asset(this.sellingCode, this.sellingIssuer);

        try {
            const operations = [
                this.stellarServer.sdk.Operation.manageOffer({
                    selling: sellingAsset,
                    buying: this.buyingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(this.buyingCode, this.buyingIssuer),
                    amount: validStellarNumber(sellingAmount),
                    price: validStellarNumber(this.price)
                })
            ];

            //TODO figure out how to enable fees... (Path payments

            //if (parseFloat(this.fee) > 0) {
            //    const lupoexAccount = this.store.getState().lupoexAccount;
            //    const lupoexHasTrust = sellingAsset.isNative() || _find(lupoexAccount.balances, b => b.asset_code === sellingAsset.getCode() && b.asset_issuer === sellingAsset.getIssuer());
//
            //    if (!lupoexHasTrust) {
            //        this.loading++;
//
            //        await this.lupoexResource.trust(sellingAsset.getCode(), sellingAsset.getIssuer());
//
            //        this.loading--;
            //    }
//
            //    operations.push(
            //        this.stellarServer.sdk.Operation.payment({
            //            destination: window.lupoex.publicKey,
            //            asset: sellingAsset,
            //            amount: fee.toString()
            //        })
            //    );
            //}

            this.modalVM.close(operations);
        }
        catch(e) {
            this.alertToaster.error('Unexpected error occured. Please check your inputs. Your offer was NOT submitted to the network.');
            this.modalVM.dismiss();
        }

    }

    cancel() {
        this.modalVM.dismiss();
    }
}
