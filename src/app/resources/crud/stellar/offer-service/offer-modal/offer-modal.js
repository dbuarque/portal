/**
 * Created by istrauss on 5/8/2017.
 */

import {inject} from 'aurelia-framework'
import {StellarServer} from 'global-resources';

@inject(StellarServer)
export class OfferModal {

    loading = 0;

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    activate(params) {
        this.nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.modalVM = params.modalVM;
        this.sellingCode = params.passedInfo.sellingCode;
        this.sellingIssuer = params.passedInfo.sellingIssuer;
        this.sellingAmount = params.passedInfo.sellingAmount;
        this.buyingCode = params.passedInfo.buyingCode;
        this.buyingIssuer = params.passedInfo.buyingIssuer;
        this.price = params.passedInfo.price;
    }

    async confirm() {
        this.loading++;

        //We need to update the account prior to creating the transaction in order to ensure that the account.sequence is updated.
        await this.appStore.dispatch(this.appActionCreators.updateAccount());

        const account = this.appStore.getState().account;

        const transactionBuilder = new this.stellarServer.sdk.TransactionBuilder(
            new this.stellarServer.sdk.Account(account.id, account.sequence)
        );

        //Add the payment operation
        transactionBuilder
            .addOperation(
                this.stellarServer.sdk.Operation.manageOffer({
                    selling: this.sellingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(this.sellingCode, this.sellingIssuer),
                    buying: this.buyingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(this.buyingCode, this.buyingIssuer),
                    amount: this.sellingAmount,
                    price: this.price,
                    source: account
                })
            );

        const transaction = transactionBuilder.build();

        this.modalVM.close(transaction);
    }

    cancel() {
        this.modalVM.dismiss();
    }
}
