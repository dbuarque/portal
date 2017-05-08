/**
 * Created by istrauss on 5/8/2017.
 */

import {bindable} from 'aurelia-framework';

export class MemoSelectCustomElement {

    @bindable type;
    @bindable value;
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
