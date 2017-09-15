/**
 * Created by istrauss on 9/11/2017.
 */

import {inject} from 'aurelia-framework';
import BigNumber from 'bignumber.js';
import {Store} from 'au-redux';

export class BuyingAmountValueConverter {
    toView(order) {
        return (new BigNumber(order.amount)).times(order.price).toString();
    }
}

@inject(Store)
export class IncludesMyOfferCssValueConverter {
    constructor(store) {
        this.store = store;
    }

    toView(order) {
        return order.sellerIds.indexOf(this.store.getState().account.id) > -1 ? 'includes-my-offer' : '';
    }
}