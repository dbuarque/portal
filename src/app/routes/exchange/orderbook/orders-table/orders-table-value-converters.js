/**
 * Created by istrauss on 3/27/2017.
 */

import {inject} from 'aurelia-framework'

export class OrderAmountValueConverter {
    toView(o, selling, flip) {
        const amount = parseFloat(o.amount, 10);
        const ratio = flip ? o.price_r.d / o.price_r.n : o.price_r.n / o.price_r.d;
        const result = selling ? amount : amount * ratio;
        return parseFloat(result.toFixed(6));
    }
}

@inject(OrderAmountValueConverter)
export class SumOrdersAmountValueConverter {
    constructor(orderAmount) {
        this.orderAmount = orderAmount;
    }
    toView(orders, toIndex, selling, flip) {
        return orders.slice(0, toIndex + 1).reduce((result, o) => {
            const orderAmount = this.orderAmount.toView(o, selling, flip);
            return result + orderAmount;
        }, 0);
    }
}

export class ToPrecisionValueConverter {
    toView(num, precision) {
        return parseFloat(num, 10).toPrecision(precision);
    }
}
