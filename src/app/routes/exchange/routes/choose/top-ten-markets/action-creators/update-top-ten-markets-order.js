import {inject} from 'aurelia-framework';
import {actionCreator} from 'au-redux';
import {MarketResource} from 'app-resources';
import {UPDATE_TOP_TEN_ORDER} from "../top-ten-markets.action-types";
import {MarketToAssetPairValueConverter} from '../../choose.value-converters';
import {RefreshTopTenMarketsActionCreator} from './refresh-top-ten-markets';

@actionCreator()
@inject(MarketResource, MarketToAssetPairValueConverter, RefreshTopTenMarketsActionCreator)
export class UpdateTopTenMarketsOrderActionCreator {

    constructor(marketResource, marketToAssetPair, refreshTopTenMarkets) {
        this.marketResource = marketResource;
        this.marketToAssetPair = marketToAssetPair;
        this.refreshTopTenMarkets = refreshTopTenMarkets;
    }

    create(order) {
        return (dispatch, getState) => {
            const topTen = getState().exchange.choose.topTenMarkets;
            if (topTen && topTen.order && topTen.order !== order) {
                dispatch({
                    type: UPDATE_TOP_TEN_ORDER,
                    payload: order
                });

                this.refreshTopTenMarkets.dispatch();
            }

        };
    }
}
