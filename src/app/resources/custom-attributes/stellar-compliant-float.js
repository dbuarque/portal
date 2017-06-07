/**
 * Created by istrauss on 6/6/2017.
 */

import {inject, bindable} from 'aurelia-framework';

@inject(Element)
export class StellarCompliantFloatCustomAttribute {

    fixedLimit = 7;

    constructor(element) {
        this.element = element;
    }

    attached() {
        this.$element = $(this.element);

        this.$element.keyup(this.ensureLessThanLimit.bind(this));
        this.$element.change(this.ensureLessThanLimit.bind(this));
    }

    ensureLessThanLimit() {
        if (!this.$element) {
            return;
        }

        const val = this.$element.val();

        if (!val) {
            return;
        }

        //This number is too big for javascript to handle.
        if (val.length > 17) {
            this.$element.val(val.slice(0, 17)).trigger('change');
            return;
        }

        const float = parseFloat(val);
        const parsed = float.toString();
        const fixed = float.toFixed(this.fixedLimit);

        //Ensure that there are not too many decimal places on the number (stellar only allows 7)
        if (parsed.length <= fixed.length) {
            return;
        }

        this.$element.val(fixed).trigger('change');
    }
}
