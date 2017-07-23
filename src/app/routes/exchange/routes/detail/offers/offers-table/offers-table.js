/**
 * Created by istrauss on 3/27/2017.
 */

import {bindable, bindingMode} from 'aurelia-framework';

export class OffersTableCustomElement {
    @bindable assetPair;
    @bindable selling;
    @bindable orders = [];
    @bindable({defaultBindingMode: bindingMode.twoWay}) price;

    bind() {
        this.ordersChanged();
    }

    priceFromFraction(order) {
        return order ? order.price_r.n / order.price_r.d : '';
    }

    ordersChanged() {
        if (!this.priceIsSet) {
            this.price = this.priceFromFraction(this.orders[0]);
            this.priceIsSet = true;
        }
    }
}
