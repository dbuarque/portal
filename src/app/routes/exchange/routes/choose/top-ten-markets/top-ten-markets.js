/**
 * Created by istrauss on 6/16/2017.
 */

import {inject} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {MarketResource} from 'app-resources';
import {UpdateAssetPairActionCreator} from '../../../action-creators';
import {MarketToAssetPairValueConverter} from "../choose-value-converters";
import {TopTenMarketsActionCreators} from "./top-ten-markets-action-creators";

@inject(Element, Store, MarketResource, UpdateAssetPairActionCreator, MarketToAssetPairValueConverter, TopTenMarketsActionCreators)
export class TopTenMarkets {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.choose.topTenMarkets.results')
    markets = [];

    @connected('exchange.choose.topTenMarkets.order')
    order;

    loading = 0;
    nativeAssetCode = window.lupoex.stellar.nativeAssetCode;

    constructor(element, store, marketResource, updateAssetPair, marketToAssetPair, topTenMarketsActionCreators) {
        this.element = element;
        this.store = store;
        this.marketResource = marketResource;
        this.updateAssetPair = updateAssetPair;
        this.marketToAssetPair = marketToAssetPair;
        this.topTenMarketsActionCreators = topTenMarketsActionCreators;
    }

    bind() {
        this.refresh();
    }

    async refresh() {
        this.loading++;

        await this.store.dispatch(
            this.topTenMarketsActionCreators.refreshTopTenMarkets()
        );

        if (!this.assetPair && this.markets.length > 0) {
            await this.updateAssetPair.dispatch(
                this.marketToAssetPair.toView(this.markets[0])
            )
        }

        this.loading--;
    }

    async changeOrder(newOrder) {
        this.loading++;

        await this.store.dispatch(
            this.topTenMarketsActionCreators.updateTopTenMarketsOrder(newOrder)
        );

        this.loading--;
    }

    chooseMarket(market) {
        this.updateAssetPair.dispatch(
            this.marketToAssetPair.toView(market)
        );
    }
}
