/**
 * Created by istrauss on 9/11/2017.
 */

import {inject} from 'aurelia-framework';
import BigNumber from 'bignumber.js';
import {Store} from 'aurelia-redux-connect';

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
        const account = this.store.getState().myAccount;
        return account && order.sellerIds.indexOf(account.accountId) > -1 ? 'includes-my-offer' : '';
    }
}
