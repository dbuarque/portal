/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../../exchange-action-creators';
import {AppActionCreators} from '../../../../app-action-creators';
    
@inject(Router, AppStore, ExchangeActionCreators, AppActionCreators)
export class Detail {
    
    constructor(router, appStore, exchangeActionCreators, appActionCreators) {
        this.router = router;
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
        this.appActionCreators = appActionCreators;

        this.isMobile = window.innerWidth < 500;
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

        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.appStore.getState();

        this.account = state.account;

        if (state.offers) {
            return;
        }

        this.appStore.dispatch(this.appActionCreators.updateOffers());
    }

    attached() {
        this.updateRouteTitle();
    }

    updateRouteTitle() {
        this.router.currentInstruction.config.title = this.assetPair.buying.code + '/' + this.assetPair.selling.code;
    }
}
