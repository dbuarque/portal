/**
 * Created by istrauss on 9/28/2016.
 */

import {inject, bindable} from 'aurelia-framework';

@inject(Element)
export class SpinnerOverlayCustomElement {

    @bindable minHeight = 350;
    @bindable size = '3x';
    @bindable transparent = false;
    @bindable top = 75;
    @bindable spin;

    constructor(element) {
        this.element = element;
    }

    attached() {
        this.parent = $(this.element).parent();
        this.parentMinHeight = this.parent.css('min-height');

        let parentPosition = this.parent.css('position');
        if (parentPosition !== 'fixed' && parentPosition !== 'absolute') {
            this.parent.css('position', 'relative');
        }

        $(this.element).find('.spinner-overlay').css('padding-top', parseInt(this.top, 10));

        this.spinChanged();
    }

    spinChanged() {
        if (!this.parent) {
            return;
        }

        this.parent.css(
            'min-height',
            this.spin ? this.minHeight + 'px' : this.parentMinHeight
        );
    }
}
