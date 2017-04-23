/**
 * Created by istrauss on 3/27/2017.
 */

import {bindable} from 'aurelia-framework';

export class OrdersTableCustomElement {
    @bindable assetPair;
    @bindable selling;
    @bindable orders = [];
}
