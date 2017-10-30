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
    
    constructor(router, store, exchangeActionCreators, detailActionCreators, orderbookUpdater, recentTradesUpdater, myOffersUpdater, myAssetPairUpdater) {
        this.router = router;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
        this.detailActionCreators = detailActionCreators;

        this.switchAssets = this._switchAssets.bind(this);
        this.reselect = this._reselect.bind(this);

        orderbookUpdater.init();
        recentTradesUpdater.init();
        myOffersUpdater.init();
        myAssetPairUpdater.init();
    }
    
    async activate(params) {
        await this.store.dispatch(this.exchangeActionCreators.updateAssetPair(
            {
                buying: {
                    code: params.buyingCode,
                    issuer: params.buyingType.toLowerCase() === 'native' ? null : params.buyingIssuer,
                    type: params.buyingType
                },
                selling: {
                    code: params.sellingCode,
                    issuer: params.sellingType.toLowerCase() === 'native' ? null : params.sellingIssuer,
                    type: params.sellingType
                }
            }
        ));
    }

    assetPairChanged() {
        if (!this.assetPair.selling || !this.assetPair.buying) {
            this.router.navigateToRoute('choose');
        }
    }

    changeOfferType(newOfferType) {
        this.store.dispatch(this.detailActionCreators.updateDisplayedOfferType(newOfferType));
    }

    _reselect(asset, type) {
        const newAssetPair = {
            ...this.assetPair,
            [type]: asset
        };

        this.goToNewAssetPair(newAssetPair);
    }

    _switchAssets() {
        const newAssetPair = {
            buying: this.assetPair.selling,
            selling: this.assetPair.buying
        };

        this.goToNewAssetPair(newAssetPair);
    }

    goToNewAssetPair(newAssetPair) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
        const buyingIsNative = newAssetPair.buying.type.toLowerCase() === 'native';
        const sellingIsNative = newAssetPair.selling.type.toLowerCase() === 'native';

        this.router.navigateToRoute('detail', {
            buyingType: newAssetPair.buying.type,
            buyingCode: buyingIsNative ? nativeAssetCode : newAssetPair.buying.code,
            buyingIssuer: buyingIsNative ? 'Stellar': newAssetPair.buying.issuer.accountId,
            sellingType: newAssetPair.selling.type,
            sellingCode: sellingIsNative ? nativeAssetCode : newAssetPair.selling.code,
            sellingIssuer: sellingIsNative ? 'Stellar': newAssetPair.selling.issuer.accountId
        });
    }


    //updateRouteTitle() {
    //    if (!this.router.currentInstruction || !this.assetPair) {
    //        return;
    //    }
//
    //    this.router.currentInstruction.config.title = this.assetPair.buying.code + '/' + this.assetPair.selling.code;
    //}
}
