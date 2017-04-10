/**
 * Created by istrauss on 3/27/2017.
 */

import {inject} from 'aurelia-framework'

export class OrderAmountValueConverter {
    toView(o, sellingBuying) {
        const amount = parseFloat(o.amount, 10);
        const result = sellingBuying === 'selling' ? amount : amount * o.price_r.n / o.price_r.d;
        return parseFloat(result.toFixed(6));
    }
}

@inject(OrderAmountValueConverter)
export class SumOrdersAmountValueConverter {
    constructor(orderAmount) {
        this.orderAmount = orderAmount;
    }
    toView(orders, toIndex, sellingBuying) {
        return orders.slice(0, toIndex + 1).reduce((result, o) => {
            const orderAmount = this.orderAmount.toView(o, sellingBuying);
            return result + orderAmount;
        }, 0);
    }
}

export class ToPrecisionValueConverter {
    toView(num, precision) {
        return parseFloat(num, 10).toPrecision(precision);
    }
}
