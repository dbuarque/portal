/**
 * Created by istrauss on 11/24/2016.
 */

import {bindable} from 'aurelia-framework';


export class LabelVcCustomElement {

    @bindable valueConverter;
    @bindable value;

    valueChanged() {
        this.displayValue = this.valueConverter ? this.valueConverter.toView(this.value) : this.value;
    }
}
