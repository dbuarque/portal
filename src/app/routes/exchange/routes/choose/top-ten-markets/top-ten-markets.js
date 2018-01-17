/**
 * Created by istrauss on 6/16/2017.
 */

import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {EventHelper} from 'global-resources';
import {UpdateAssetPairActionCreator} from '../../../action-creators';
import {MarketToAssetPairValueConverter} from '../choose.value-converters';
import {UpdateTopTenMarketsOrderActionCreator} from './action-creators';
import {TopMarketsStream, TopTenMarketsUpdater} from './resources';

@inject(
    Element, UpdateAssetPairActionCreator, MarketToAssetPairValueConverter,
    UpdateTopTenMarketsOrderActionCreator, TopMarketsStream, TopTenMarketsUpdater
)
export class TopTenMarkets {
    @connected('exchange.choose.topTenMarkets.results')
    markets = {};

    @connected('exchange.choose.topTenMarkets.order')
    order;

    @computedFrom('markets', 'order')
    get marketsList() {
        return this.markets['by' + this.order.slice(0, 1).toUpperCase() + this.order.slice(1)];
    }

    loading = 0;
    nativeAssetCode = window.stellarport.stellar.nativeAssetCode;

    constructor(element, updateAssetPair, marketToAssetPair, updateTopTenMarkets, topMarketsStream, topTenMarketsUpdater) {
        this.element = element;
        this.updateAssetPair = updateAssetPair;
        this.marketToAssetPair = marketToAssetPair;
        this.updateTopTenMarkets = updateTopTenMarkets;
        this.topMarketsStream = topMarketsStream;
        this.topTenMarketsUpdater = topTenMarketsUpdater;
    }

    bind() {
        this.loading++;

        this.topMarketsStream.init();
        this.topTenMarketsUpdater.init();

        this.loading--;
    }

    unbind() {
        this.topMarketsStream.deinit();
        this.topTenMarketsUpdater.deinit();
    }

    async changeOrder(newOrder) {
        this.loading++;

        await this.updateTopTenMarkets.dispatch(newOrder);

        this.loading--;
    }

    async chooseMarket(market) {
        await this.updateAssetPair.dispatch(
            this.marketToAssetPair.toView(market)
        );

        EventHelper.emitEvent(
            this.element,
            'go-trade'
        );
    }
}
