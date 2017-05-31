/**
 * Created by istrauss on 1/7/2017.
 */


import {inject} from 'aurelia-framework';
import {namespace, exchangeActionTypes} from './exchange-action-types';
import {StellarServer} from 'global-resources';
import {OrderAmountValueConverter, SumOrdersAmountValueConverter} from './exchange-value-converters';

const {UPDATE_ASSET_PAIR, REFRESH_ORDERBOOK} = exchangeActionTypes;

@inject(StellarServer, OrderAmountValueConverter, SumOrdersAmountValueConverter)
export class ExchangeActionCreators {

    constructor(stellarServer, orderAmount, sumOrdersAmount) {
        this.stellarServer = stellarServer;
        this.orderAmount = orderAmount;
        this.sumOrdersAmount = sumOrdersAmount;
    }

    updateAssetPair(assetPair) {
        return {
            type: UPDATE_ASSET_PAIR,
            payload: {
                ...assetPair
            }
        };
    }

    refreshOrderbook() {
        return async (dispatch, getState) => {
            const assetPair = getState().exchange.assetPair;

            dispatch({
                type: REFRESH_ORDERBOOK,
                payload: {
                    loading: true
                }
            });

            const orderbook = await this.stellarServer.orderbook(
                    assetPair.selling.code === 'XLM' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(assetPair.selling.code, assetPair.selling.issuer),
                    assetPair.buying.code === 'XLM' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(assetPair.buying.code, assetPair.buying.issuer)
                )
                .call();

            orderbook.asks = orderbook.asks.map((a, index) => {
                return {
                    ...a,
                    buying_amount: this.orderAmount.toView(a, true, false),
                    selling_amount: this.orderAmount.toView(a, true, true),
                    buying_depth: this.sumOrdersAmount.toView(orderbook.asks, index, true, false),
                    selling_depth: this.sumOrdersAmount.toView(orderbook.asks, index, true, true)
                };
            });

            orderbook.bids = orderbook.bids.map((b, index) => {
                return {
                    ...b,
                    buying_amount: this.orderAmount.toView(b, false, false),
                    selling_amount: this.orderAmount.toView(b, false, true),
                    buying_depth: this.sumOrdersAmount.toView(orderbook.bids, index, false, false),
                    selling_depth: this.sumOrdersAmount.toView(orderbook.bids, index, false, true)
                };
            });

           dispatch({
               type: REFRESH_ORDERBOOK,
               payload: orderbook
           });
        }
    }
}
