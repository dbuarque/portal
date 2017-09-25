/**
 * Created by Ishai on 4/26/2017.
 */


import {validStellarNumber} from './helpers';
import {inject} from 'aurelia-framework'

export class FormatNumberValueConverter {
    toView(num, sigFigs = 8) {
        sigFigs = parseInt(sigFigs);

        //Make sure sigFigs meets requirements of toPrecision()
        if (isNaN(sigFigs) || sigFigs < 1 || sigFigs > 21) {
            sigFigs = 8;
        }

        if (num < 1) {
            return num.toPrecision(sigFigs);
        }
        return d3.format(',.' + sigFigs + 's')(num).replace('k', 'K').replace('G', 'B');
    }
}

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

export class ToPrecisionValueConverter {
    toView(num, precision) {
        let result = parseFloat(num, 10).toPrecision(precision);
        const resultSplit = result.split('.');
        if (resultSplit.length > 1 && resultSplit[1].length > 7) {
            result = parseFloat(result).toFixed(7);
        }

        return result;
    }
}

export class ShortenAddressValueConverter {
    toView(address, numLetters = 3) {
        return address.slice(0, numLetters) + '...' + address.slice(address.length - numLetters);
    }
}

export class ValidStellarNumberValueConverter {
    toView(num) {
        return validStellarNumber(num);
    }
}
