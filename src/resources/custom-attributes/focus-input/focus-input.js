/**
 * Created by Ishai on 12/7/2016.
 */

import {inject} from 'aurelia-framework';

@inject(Element)
export class FocusInputCustomAttribute {
    constructor(element) {
        this.element = element;
    }

    attached() {
        $(this.element).find('input').first().focus();
    }
}
