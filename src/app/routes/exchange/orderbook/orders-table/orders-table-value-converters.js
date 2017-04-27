/**
 * Created by istrauss on 3/27/2017.
 */

import {inject} from 'aurelia-framework'
import {FormatNumberValueConverter} from 'app-resources';

export class OrderAmountValueConverter {
    toView(o, selling, flip) {
        const amount = parseFloat(o.amount, 10);
        const ratio = flip ? o.price_r.d / o.price_r.n : o.price_r.n / o.price_r.d;
        return selling ? amount : amount * ratio;
    }
}

@inject(OrderAmountValueConverter, FormatNumberValueConverter)
export class SumOrdersAmountValueConverter {
    constructor(orderAmount, formatNumber) {
        this.orderAmount = orderAmount;
        this.formatNumber = formatNumber;
    }
    toView(orders, toIndex, selling, flip) {
        const sum = orders.slice(0, toIndex + 1).reduce((result, o) => {
            const orderAmount = this.orderAmount.toView(o, selling, flip);
            return result + orderAmount;
        }, 0);

        return this.formatNumber.toView(sum);
    }
}

export class ToPrecisionValueConverter {
    toView(num, precision) {
        return parseFloat(num, 10).toPrecision(precision);
    }
}
