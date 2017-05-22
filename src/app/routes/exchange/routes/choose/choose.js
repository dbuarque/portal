/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';

@inject(Router, AppStore)    
export class Choose {

    constructor(router, appStore) {
        this.router = router;
        this.appStore = appStore;
    }
    
    load(e) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const assetPair = this.appStore.getState().exchange.assetPair;
        this.router.navigateToRoute('detail', {
            buyingCode: assetPair.buying.code,
            buyingIssuer: assetPair.buying.code === nativeAssetCode ? 'native': assetPair.buying.issuer,
            sellingCode: assetPair.selling.code,
            sellingIssuer: assetPair.selling.code === nativeAssetCode ? 'native': assetPair.selling.issuer
        })
    }
}
