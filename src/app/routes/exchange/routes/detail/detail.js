/**
 * Created by istrauss on 5/21/2017.
 */

import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';
import {ExchangeActionCreators} from '../../exchange-action-creators';
import {DetailActionCreators} from './detail-action-creators';
import {OrderbookUpdater} from './orderbook-updater';
import {RecentTradesUpdater} from './recent-trades-updater';
import {MyOffersUpdater} from './my-offers-updater';
import {MyAssetPairUpdater} from './my-asset-pair-updater';
    
@inject(Router, Store, ExchangeActionCreators, DetailActionCreators, OrderbookUpdater, RecentTradesUpdater, MyOffersUpdater, MyAssetPairUpdater)
export class Detail {

    @connected('myAccount')
    account;

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.displayedOfferType')
    displayedOfferType;

    get isMobile() {
        return window.innerWidth < 500;
    }
    
    constructor(router, store, exchangeActionCreators, detailActionCreators, orderbookUpdater, recentTradesUpdater, myOffersUpdater, myAssetPairUpdater) {
        this.router = router;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
        this.detailActionCreators = detailActionCreators;

        orderbookUpdater.init();
        recentTradesUpdater.init();
        myOffersUpdater.init();
        myAssetPairUpdater.init();
    }
    
    activate(params) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        
        this.store.dispatch(this.exchangeActionCreators.updateAssetPair(
            {
                buying: {
                    code: params.buyingCode,
                    issuer: params.buyingCode === nativeAssetCode ? undefined : params.buyingIssuer
                },
                selling: {
                    code: params.sellingCode,
                    issuer: params.sellingCode === nativeAssetCode ? undefined : params.sellingIssuer
                }
            }
        ));
    }

    assetPairChanged() {
        this.updateRouteTitle();
    }

    attached() {
        this.updateRouteTitle();
    }

    changeOfferType(newOfferType) {
        this.store.dispatch(this.detailActionCreators.updateDisplayedOfferType(newOfferType));
    }


    updateRouteTitle() {
        if (!this.router.currentInstruction || !this.assetPair) {
            return;
        }

        this.router.currentInstruction.config.title = this.assetPair.buying.code + '/' + this.assetPair.selling.code;
    }
}
