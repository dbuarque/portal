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

    alertConfig = {
        type: 'info',
        message: 'Quick select a market from the table below or select one of the dashed assets to search through all available assets.',
        dismissible: false
    };

    constructor(router, store, exchangeActionCreators) {
        this.router = router;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;

        this.switchAssets = this._switchAssets.bind(this);
        this.reselect = this._reselect.bind(this);
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

    _reselect(asset, type) {
        this.store.dispatch(
            this.exchangeActionCreators.updateAssetPair({
                [type]: asset
            })
        );
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
