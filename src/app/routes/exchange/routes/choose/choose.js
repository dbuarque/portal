/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';
import {ExchangeActionCreators} from '../../exchange-action-creators';

@inject(Router, Store, ExchangeActionCreators)
export class Choose {

    @connected('exchange.assetPair')
    assetPair;

    constructor(router, store, exchangeActionCreators) {
        this.router = router;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;

        this.switchAssets = this._switchAssets.bind(this);
    }

    goTrade(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const buyingIsNative = this.assetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = this.assetPair.selling.type.toLowerCase() === 'native';

        this.router.navigateToRoute('detail', {
            buyingType: this.assetPair.buying.type,
            buyingCode: buyingIsNative ? nativeAssetCode : this.assetPair.buying.code,
            buyingIssuer: buyingIsNative ? 'Stellar': this.assetPair.buying.issuer.accountId,
            sellingType: this.assetPair.selling.type,
            sellingCode: sellingIsNative ? nativeAssetCode : this.assetPair.selling.code,
            sellingIssuer: sellingIsNative ? 'Stellar': this.assetPair.selling.issuer.accountId
        });
    }

    _switchAssets() {
        this.store.dispatch(
            this.exchangeActionCreators.updateAssetPair({
                buying: this.assetPair.selling,
                selling: this.assetPair.buying
            })
        );
    }
}
