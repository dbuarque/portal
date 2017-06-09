/**
 * Created by istrauss on 3/27/2017.
 */

import {bindable} from 'aurelia-framework';

export class OffersTableCustomElement {
    @bindable assetPair;
    @bindable selling;
    @bindable orders = [];
}
