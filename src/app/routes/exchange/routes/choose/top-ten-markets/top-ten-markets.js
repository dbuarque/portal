/**
 * Created by istrauss on 6/16/2017.
 */

import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {EventHelper} from 'global-resources';
import {MarketResource, TomlCache} from 'app-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Element, Store, MarketResource, TomlCache, ExchangeActionCreators)
export class TopTenMarkets {

    markets = [];
    loading = 0;
    order = 'trade_count';

    constructor(element, store, marketResource, tomlCache, exchangeActionCreators) {
        this.element = element;
        this.store = store;
        this.marketResource = marketResource;
        this.tomlCache = tomlCache;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.refresh();
    }

    async refresh() {
        this.loading++;

        let markets = await this.marketResource.topTen(this.order);

        this.markets = await Promise.all(
            markets.map(m => {
                return Promise.all([
                    this.tomlCache.assetToml({
                        code: m.bought_asset_code,
                        issuer: m.bought_asset_issuer
                    }),
                    this.tomlCache.assetToml({
                        code: m.sold_asset_code,
                        issuer: m.sold_asset_issuer
                    })
                ])
                    .then(tomls => {
                        m.bought_asset_toml = tomls[0];
                        m.sold_asset_toml = tomls[1];

                        return m;
                    });
            })
        );

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

        this.store.dispatch(this.exchangeActionCreators.updateAssetPair({
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
