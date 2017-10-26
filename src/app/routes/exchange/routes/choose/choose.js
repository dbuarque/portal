/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';

@inject(Router, Store)
export class Choose {

    @connected('exchange.assetPair')
    assetPair;

    constructor(router, store) {
        this.router = router;
        this.store = store;
    }

    goTrade(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const buyingIsNative = this.assetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = this.assetPair.selling.type.toLowerCase() === 'native';

        this.router.navigateToRoute('detail', {
            buyingType: this.assetPair.buying.type,
            buyingCode: buyingIsNative ? nativeAssetCode : this.assetPair.buying.code,
            buyingIssuer: buyingIsNative ? 'Stellar': this.assetPair.buying.issuer,
            sellingType: this.assetPair.selling.type,
            sellingCode: sellingIsNative ? nativeAssetCode : this.assetPair.selling.code,
            sellingIssuer: sellingIsNative ? 'Stellar': this.assetPair.selling.issuer
        });
    }
}
