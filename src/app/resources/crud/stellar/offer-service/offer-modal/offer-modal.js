/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework'
import {StellarServer, AppStore} from 'global-resources';
import {AppActionCreators} from '../../../../../app-action-creators';

@inject(StellarServer, AppStore, AppActionCreators)
export class OfferModal {

    loading = 0;

    constructor(stellarServer, appStore, appActionCreators) {
        this.stellarServer = stellarServer;
        this.appStore = appStore;
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
        this.trustline = params.passedInfo.trustline;
        this.price = params.passedInfo.price;
    }

    async confirm() {
        this.modalVM.dismissible = false;
        this.loading++;

        //We need to update the account prior to creating the transaction in order to ensure that the account.sequence is updated.
        await this.appStore.dispatch(this.appActionCreators.updateAccount());

        const account = this.appStore.getState().account;

        const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
            new this.stellarServer.sdk.Account(account.id, account.sequence)
        );

        if (this.trustline) {
            transactionBuilder
                .addOperation(
                    this.stellarServer.sdk.Operation.changeTrust({
                        asset: this.buyingCode === this.nativeAssetCode ?
                            this.stellarServer.sdk.Asset.native() :
                            new this.stellarServer.sdk.Asset(this.buyingCode, this.buyingIssuer),
                        limit: this.trustline,
                        source: account.id
                    })
                )
        }

        transactionBuilder
            .addOperation(
                this.stellarServer.sdk.Operation.manageOffer({
                    selling: this.sellingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(this.sellingCode, this.sellingIssuer),
                    buying: this.buyingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(this.buyingCode, this.buyingIssuer),
                    amount: this.sellingAmount.slice(0, 15),
                    price: this.price.toString().slice(0, 15),
                    source: account.id
                })
            );

        const transaction = transactionBuilder.build();

        this.modalVM.close(transaction);
    }

    cancel() {
        this.modalVM.dismiss();
    }
}
