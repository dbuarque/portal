/**
 * Created by ISHAI-NOTEBOOK on 7/14/2016.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';

@inject(Element)
export class IdentifyUserCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) action;

    constructor(element) {
        this.element = element;
    }

    bind() {
        this.action = this.action || 'login';
    }
}
