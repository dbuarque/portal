/**
 * Created by istrauss on 3/27/2017.
 */

import BigNumber from 'bignumber.js';
import {inject, bindable, computedFrom} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {DetailActionCreators} from '../../detail-action-creators';

@inject(Store, DetailActionCreators)
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

    constructor(store, detailActionCreators) {
        this.store = store;
        this.detailActionCreators = detailActionCreators;
    }

    updateNewOfferPrice(order) {
        this.store.dispatch(this.detailActionCreators.updateNewOffer({
            [this.selling ? 'biddingPrice' : 'askingPrice']: this.priceFromFraction(order)
        }));
    }

    priceFromFraction(order) {
        return order ? new BigNumber(order.priceNumerator).dividedBy(order.priceDenominator) : '';
    }
}
