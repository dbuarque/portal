/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store} from 'au-redux';

@inject(Router, Store)
export class Choose {

    constructor(router, store) {
        this.router = router;
        this.store = store;
    }
    
    load(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const assetPair = this.store.getState().exchange.assetPair;
        this.router.navigateToRoute('detail', {
            buyingCode: assetPair.buying.code,
            buyingIssuer: assetPair.buying.code === nativeAssetCode ? 'native': assetPair.buying.issuer,
            sellingCode: assetPair.selling.code,
            sellingIssuer: assetPair.selling.code === nativeAssetCode ? 'native': assetPair.selling.issuer
        })
    }
}
