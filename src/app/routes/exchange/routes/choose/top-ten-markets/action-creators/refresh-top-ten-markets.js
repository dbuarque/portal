import {inject} from 'aurelia-framework';
import {actionCreator} from 'au-redux';
import {MarketResource} from 'app-resources';
import {UPDATE_TOP_TEN_RESULTS} from "../top-ten-markets.action-types";

@actionCreator()
@inject(MarketResource)
export class RefreshTopTenMarketsActionCreator {

    constructor(marketResource) {
        this.marketResource = marketResource;
    }

    create() {
        return async (dispatch, getState) => {
            const order = getState().exchange.choose.topTenMarkets.order;
            const markets = await this.marketResource.topTen(order);

            dispatch({
                type: UPDATE_TOP_TEN_RESULTS,
                payload: markets
            });
        };
    }
}
