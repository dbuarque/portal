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

        let val = this.$element.val();

        if (!val) {
            return;
        }

        //This number is too big for javascript to handle.
        if (val.length > 17) {
            val = val.slice(0, 17);
        }

        let float = parseFloat(val);

        if (float > 922337203685.4775807) {
            float = 922337203685.4775807;
        }

        let parsed = float.toString();
        const fixed = float.toFixed(this.fixedLimit);

        //Ensure that there are not too many decimal places on the number (stellar only allows 7)
        if (parsed.length > fixed.length) {
            parsed = fixed;
        }

        if (this.$element.val() !== parsed) {
            this.$element.val(parsed).trigger('change');
        }
    }
}
