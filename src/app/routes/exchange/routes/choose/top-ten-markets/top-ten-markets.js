/**
 * Created by istrauss on 6/16/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'au-redux';
import {EventHelper} from 'global-resources';
import {MarketResource} from 'app-resources';
import {UpdateAssetPairActionCreator} from '../../../action-creators';
import {MarketToAssetPairValueConverter} from '../choose.value-converters';
import {UpdateTopTenMarketsOrderActionCreator, RefreshTopTenMarketsActionCreator} from './action-creators';

@inject(
    Element, MarketResource, UpdateAssetPairActionCreator,
    MarketToAssetPairValueConverter, UpdateTopTenMarketsOrderActionCreator, RefreshTopTenMarketsActionCreator
)
export class TopTenMarkets {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.choose.topTenMarkets.results')
    markets = [];

    @connected('exchange.choose.topTenMarkets.order')
    order;

    loading = 0;
    nativeAssetCode = window.lupoex.stellar.nativeAssetCode;

    constructor(element, marketResource, updateAssetPair, marketToAssetPair, updateTopTenMarkets, refreshTopTenMarkets) {
        this.element = element;
        this.marketResource = marketResource;
        this.updateAssetPair = updateAssetPair;
        this.marketToAssetPair = marketToAssetPair;
        this.updateTopTenMarkets = updateTopTenMarkets;
        this.refreshTopTenMarkets = refreshTopTenMarkets;
    }

    bind() {
        this.refresh();
    }

    async refresh() {
        this.loading++;

        await this.refreshTopTenMarkets.dispatch();

        if (!this.assetPair && this.markets.length > 0) {
            await this.updateAssetPair.dispatch(
                this.marketToAssetPair.toView(this.markets[0])
            );
        }

        this.loading--;
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
