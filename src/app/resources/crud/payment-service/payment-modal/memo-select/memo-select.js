/**
 * Created by istrauss on 5/8/2017.
 */

import {bindable, bindingMode} from 'aurelia-framework';

export class MemoSelectCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) type;
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable validationManager;

    memoTypes = [
        'Id',
        'Text',
        'Hash',
        'Return'
    ];

    onTypeChange() {
        this.value = undefined;
    }
}
