/**
 * Created by istrauss on 5/8/2017.
 */

import _find from 'lodash.find';
import {inject} from 'aurelia-framework'
import {StellarServer, AppStore, AlertToaster} from 'global-resources';
import {LupoexResource} from 'app-resources';
import {AppActionCreators} from '../../../../../app-action-creators';

@inject(StellarServer, AppStore, AlertToaster, LupoexResource, AppActionCreators)
export class OfferModal {

    loading = 0;

    constructor(stellarServer, appStore, alertToaster, lupoexResource, appActionCreators) {
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.alertToaster = alertToaster;
        this.lupoexResource = lupoexResource;
        this.appActionCreators = appActionCreators;
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.modalVM = params.modalVM;
        //type should be 'Bid' or 'Ask'
        this.type = params.passedInfo.type || 'Bid';
        this.sellingCode = params.passedInfo.sellingCode;
        this.sellingIssuer = params.passedInfo.sellingIssuer;
        this.sellingAmount = params.passedInfo.sellingAmount;
        this.buyingCode = params.passedInfo.buyingCode;
        this.buyingIssuer = params.passedInfo.buyingIssuer;
        this.buyingAmount = parseFloat(params.passedInfo.sellingAmount, 10) * parseFloat(params.passedInfo.price, 10);
        this.price = params.passedInfo.price;
    }

    async confirm() {
        this.modalVM.dismissible = false;

        const sellingAmountSplit = this.sellingAmount.split('.');
        if (sellingAmountSplit.length > 1 && sellingAmountSplit[1].length > 7) {
            this.alertToaster.error('Currency amounts cannot have more than 7 decimal places.');
            this.modalVM.dismiss();
            return;
        }

        let sellingAmount = parseFloat(this.sellingAmount);
        const fee = window.lupoex.env === 'production' ? this.calculateFee(sellingAmount) : 0;
        sellingAmount = sellingAmount - fee;
        sellingAmount = sellingAmount.toFixed(7);

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
                    amount: sellingAmount,
                    price: this.price.toPrecision(15)
                })
            ];

            if (fee) {
                const lupoexAccount = this.appStore.getState().lupoexAccount;
                const lupoexHasTrust = sellingAsset.isNative() || _find(lupoexAccount.balances, b => b.asset_code === sellingAsset.getCode() && b.asset_issuer === sellingAsset.getIssuer());

                if (!lupoexHasTrust) {
                    this.loading++;

                    await this.lupoexResource.trust(sellingAsset.getCode(), sellingAsset.getIssuer());

                    this.loading--;
                }

                operations.push(
                    this.stellarServer.sdk.Operation.payment({
                        destination: window.lupoex.publicKey,
                        asset: sellingAsset,
                        amount: fee.toString()
                    })
                );
            }

            this.modalVM.close(operations);
        }
        catch(e) {
            this.alertToaster.error('Unexpected error occured. Please check your inputs. Your offer was NOT submitted to the network.');
            this.modalVM.dismiss();
        }

    }

    calculateFee(sellingAmount) {
        let fee = sellingAmount * window.lupoex.offerFeeFactor;
        fee = fee.toFixed(7);
        return parseFloat(fee, 10);
    }

    cancel() {
        this.modalVM.dismiss();
    }
}
