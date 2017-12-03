/**
 * Created by istrauss on 5/21/2017.
 */

import './detail.scss';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {connected} from 'aurelia-redux-connect';
import {UpdateAssetPairActionCreator} from '../../action-creators';
import {UpdateDisplayedOfferTypeActionCreator} from './action-creators';
import {OrderbookUpdater, RecentTradesUpdater, MyOffersUpdater, MyAssetPairUpdater} from './resources';
    
@inject(
    Router, UpdateAssetPairActionCreator, UpdateDisplayedOfferTypeActionCreator, OrderbookUpdater,
    RecentTradesUpdater, MyOffersUpdater, MyAssetPairUpdater
)
export class Detail {

    @connected('myAccount')
    account;

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.displayedOfferType')
    displayedOfferType;

    constructor(
        router, updateAssetPair, updateDisplayedOfferType, orderbookUpdater,
        recentTradesUpdater, myOffersUpdater, myAssetPairUpdater
    ) {
        this.router = router;
        this.updateAssetPair = updateAssetPair;
        this.updateDisplayedOfferType = updateDisplayedOfferType;

        this.switchAssets = this._switchAssets.bind(this);
        this.reselect = this._reselect.bind(this);

        orderbookUpdater.init();
        recentTradesUpdater.init();
        myOffersUpdater.init();
        myAssetPairUpdater.init();
    }

    activate(params) {
        return this.updateAssetPair.dispatch({
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
        });
    }

    assetPairChanged() {
        if (!this.assetPair.selling || !this.assetPair.buying) {
            this.router.navigateToRoute('choose');
        }
    }

    changeOfferType(newOfferType) {
        this.updateDisplayedOfferType.dispatch(newOfferType);
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
