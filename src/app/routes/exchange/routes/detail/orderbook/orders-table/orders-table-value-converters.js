/**
 * Created by istrauss on 9/11/2017.
 */

import BigNumber from 'bignumber.js';

export class BuyingAmountValueConverter {
    toView(order) {
        return (new BigNumber(order.amount)).times(order.price).toString();
    }
}