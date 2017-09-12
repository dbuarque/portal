/**
 * Created by istrauss on 3/27/2017.
 */

import BigNumber from 'bignumber.js';
import {bindable, bindingMode, computedFrom} from 'aurelia-framework';
import {connected} from 'au-redux';

export class OrdersTableCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.orderbook')
    orderbook;

    @bindable
    selling;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    price;

    @computedFrom('selling')
    get type() {
        return this.selling ? 'asks' : 'bids';
    }

    @computedFrom('orderbook', 'selling')
    get orders() {
        return this.orderbook ? this.orderbook[this.type] : undefined;
    }

    orderbookChanged() {
        if (!this.priceIsSet) {
            this.price = this.priceFromFraction(this.orders[0]);
            this.priceIsSet = true;
        }
    }

    priceFromFraction(order) {
        return order ? new BigNumber(order.priceNumerator).dividedBy(order.priceDenominator) : '';
    }
}
