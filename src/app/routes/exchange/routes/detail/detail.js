/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
 import {Store} from 'au-redux';
import {ExchangeActionCreators} from '../../exchange-action-creators';
import {AppActionCreators} from '../../../../app-action-creators';
    
@inject(Router, Store, ExchangeActionCreators, AppActionCreators)
export class Detail {

    offerType = 'bid';
    
    constructor(router, store, exchangeActionCreators, appActionCreators) {
        this.router = router;
        this.store = store;
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
        
        this.store.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));

        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();

        this.account = state.account;
        this.assetPair = state.exchange.assetPair;

        this.updateRouteTitle();

        if (state.offers) {
            return;
        }

        this.store.dispatch(this.appActionCreators.updateOffers());
    }

    attached() {
        this.updateRouteTitle();
    }

    changeOfferType(newOfferType) {
        this.offerType = newOfferType;
        //this.offerTabs.selectTab('tab-' + newOfferType);
    }


    updateRouteTitle() {
        if (!this.router.currentInstruction || !this.assetPair) {
            return;
        }

        this.router.currentInstruction.config.title = this.assetPair.buying.code + '/' + this.assetPair.selling.code;
    }
}
