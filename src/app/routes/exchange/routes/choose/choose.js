/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';
import {ExchangeActionCreators} from "../../exchange-action-creators";

@inject(Router, Store, ExchangeActionCreators)
export class Choose {

    @connected('exchange.assetPair')
    assetPair;

    constructor(router, store, exchangeActionCreators) {
        this.router = router;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    choose(e) {
        this.store.dispatch(
            this.exchangeActionCreators.updateAssetPair(e.detail)
        );
    }
    
    load(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const assetPair = this.store.getState().exchange.assetPair;
        const buyingIsNative = assetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = assetPair.selling.type.toLowerCase() === 'native';

        this.router.navigateToRoute('detail', {
            buyingType: assetPair.buying.type,
            buyingCode: buyingIsNative ? nativeAssetCode : assetPair.buying.code,
            buyingIssuer: buyingIsNative ? 'Stellar': assetPair.buying.issuer,
            sellingType: assetPair.selling.type,
            sellingCode: sellingIsNative ? nativeAssetCode : assetPair.selling.code,
            sellingIssuer: sellingIsNative ? 'Stellar': assetPair.selling.issuer
        });
    }
}
