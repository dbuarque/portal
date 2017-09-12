/**
 * Created by istrauss on 3/27/2017.
 */

import {bindable, bindingMode} from 'aurelia-framework';
import {connected} from 'au-redux';

export class OrderbookCustomElement {

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    askingPrice;

    @bindable({
        defaultBindingMode: bindingMode.twoWay
    })
    biddingPrice;
}
