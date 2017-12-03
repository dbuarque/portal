/**
 * Created by istrauss on 3/27/2017.
 */

import BigNumber from 'bignumber.js';
import {inject, bindable, computedFrom} from 'aurelia-framework';
import {connected, Store} from 'aurelia-redux-connect';
import {UpdateMyAskActionCreator, UpdateMyBidActionCreator} from '../../action-creators';

@inject(Store, UpdateMyAskActionCreator, UpdateMyBidActionCreator)
export class OrdersTableCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.orderbook')
    orderbook;

    @bindable
    selling;

    @computedFrom('selling')
    get type() {
        return this.selling ? 'asks' : 'bids';
    }

    @computedFrom('orderbook', 'selling')
    get orders() {
        return this.orderbook ? this.orderbook[this.type] : undefined;
    }

    constructor(store, updateMyAsk, updateMyBid) {
        this.store = store;
        this.updateMyAsk = updateMyAsk;
        this.updateMyBid = updateMyBid;
    }

    updateNewOrderPrice(order) {
        if (this.type === 'bids') {
            this.updateMyAsk.dispatch({
                price: [order.priceNumerator, order.priceDenominator]
            });
        }
        else {
            this.updateMyBid.dispatch({
                price: [order.priceDenominator, order.priceNumerator]
            });
        }
    }

    priceFromFraction(order) {
        return order ? new BigNumber(order.priceNumerator).dividedBy(order.priceDenominator).toString(10) : '';
    }
}
