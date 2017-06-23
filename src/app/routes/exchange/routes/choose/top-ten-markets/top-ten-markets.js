/**
 * Created by istrauss on 6/16/2017.
 */

import {inject} from 'aurelia-framework';
import {EventHelper, AppStore} from 'global-resources';
import {MarketResource} from 'app-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Element, AppStore, MarketResource, ExchangeActionCreators)
export class TopTenMarkets {

    markets = [];
    loading = 0;
    order = 'trade_count';

    constructor(element, appStore, marketResource, exchangeActionCreators) {
        this.element = element;
        this.appStore = appStore;
        this.marketResource = marketResource;
        this.exchangeActionCreators = exchangeActionCreators;
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

    goToMarket(market) {
        const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;

        this.appStore.dispatch(this.exchangeActionCreators.updateAssetPair({
            buying: {
                code:  market.bought_asset_type === 'native' ? nativeAssetCode : market.bought_asset_code,
                issuer: market.bought_asset_type === 'native' ? undefined : market.bought_asset_issuer
            },
            selling: {
                code: market.sold_asset_type === 'native' ? nativeAssetCode : market.sold_asset_code,
                issuer: market.sold_asset_type === 'native' ? undefined : market.sold_asset_issuer
            }
        }));

        EventHelper.emitEvent(this.element, 'load');
    }
}