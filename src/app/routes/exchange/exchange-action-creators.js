/**
 * Created by istrauss on 1/7/2017.
 */


import {inject} from 'aurelia-framework';
import {namespace, exchangeActionTypes} from './exchange-action-types';
import {StellarServer} from 'global-resources';
import {OrderAmountValueConverter, SumOrdersAmountValueConverter} from 'app-resources';

const {UPDATE_ASSET_PAIR, UPDATE_ORDERBOOK} = exchangeActionTypes;

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

    updateOrderbook(orderbook) {
        return {
            type: UPDATE_ORDERBOOK,
            payload: orderbook
        }
    }
}
