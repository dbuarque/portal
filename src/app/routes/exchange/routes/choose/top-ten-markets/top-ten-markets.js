/**
 * Created by istrauss on 6/16/2017.
 */

import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {EventHelper} from 'global-resources';
import {MarketResource} from 'app-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';
import {MarketToAssetPairValueConverter} from "./top-ten-markets-value-converters";

@inject(Element, Store, MarketResource, ExchangeActionCreators, MarketToAssetPairValueConverter)
export class TopTenMarkets {

    markets = [];
    loading = 0;
    order = 'trade_count';

    constructor(element, store, marketResource, exchangeActionCreators, marketToAssetPair) {
        this.element = element;
        this.store = store;
        this.marketResource = marketResource;
        this.exchangeActionCreators = exchangeActionCreators;
        this.marketToAssetPair = marketToAssetPair;
    }

    bind() {
        this.refresh();
    }

    async refresh() {
        this.loading++;

        this.markets = await this.marketResource.topTen(this.order);

        this.loading--;
    }

    changeOrder(newOrder) {
        if (newOrder === this.order) {
            return;
        }

        this.order = newOrder;
        this.refresh();
    }

    chooseMarket(market) {
        EventHelper.emitEvent(this.element, 'choose', {
            detail: this.marketToAssetPair.toView(market)
        });
    }
}
