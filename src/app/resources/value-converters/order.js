/**
 * Created by istrauss on 9/25/2017.
 */

import {inject} from 'aurelia-framework'
import {FormatNumberValueConverter} from './number';

export class OrderAmountValueConverter {

    /**
     *
     * @param o - The order (bid or ask)
     * @param isAsk - Is this an ask (or a bid)
     * @param amountOfSellingAsset - Do you want the amount of selling asset (or buying asset).
     * @returns {*}
     */
    toView(o, isAsk = true, amountOfSellingAsset = true) {
        const amount = parseFloat(o.amount, 10);
        const price = parseFloat(o.price, 10);

        if (amountOfSellingAsset) {
            return isAsk ? amount : amount / price;
        }
        else {
            return isAsk ? amount * price : amount;
        }
    }
}

@inject(OrderAmountValueConverter, FormatNumberValueConverter)
export class SumOrdersAmountValueConverter {
    constructor(orderAmount, formatNumber) {
        this.orderAmount = orderAmount;
        this.formatNumber = formatNumber;
    }
    toView(orders, toIndex, isAsk, amountOfSellingAsset) {
        return orders.slice(0, toIndex + 1).reduce((result, o) => {
            const orderAmount = this.orderAmount.toView(o, isAsk, amountOfSellingAsset);
            return result + orderAmount;
        }, 0);
    }
}
