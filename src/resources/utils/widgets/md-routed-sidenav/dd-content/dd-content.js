/**
 * Created by istrauss on 9/27/2016.
 */

import {bindable, customElement, containerless, inject} from 'aurelia-framework';

@customElement('dd-content')
@containerless()
@inject(Element)
export class DDContent {
    @bindable parentNav;
    @bindable router;
    @bindable config;

    constructor(element) {
        this.element = element;
    }

    attached() {
        $(this.element).parent().find('.collapsible.collapsible-accordion').collapsible({});
    }
}