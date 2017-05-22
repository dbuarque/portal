/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../../exchange-action-creators';
    
@inject(Router, AppStore, ExchangeActionCreators)
export class Detail {
    
    constructor(router, appStore, exchangeActionCreators) {
        this.router = router;
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
    }
    
    activate(params) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        this.assetPair = {
            buying: {
                code: params.buyingCode,
                issuer: params.buyingCode === nativeAssetCode ? undefined : params.buyingIssuer
            },
            selling: {
                code: params.sellingCode,
                issuer: params.sellingCode === nativeAssetCode ? undefined : params.sellingIssuer
            }
        };
        
        this.appStore.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));
    }

    attached() {
        this.updateRouteTitle();
    }

    updateRouteTitle() {
        this.router.currentInstruction.config.title = this.assetPair.buying.code + '/' + this.assetPair.selling.code;
    }
}
