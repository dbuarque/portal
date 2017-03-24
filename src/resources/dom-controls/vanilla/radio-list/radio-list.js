/**
 * Created by istrauss on 3/30/2016.
 */

import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('radio-list')
export class RadioListCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable options;

    optionsChanged(newOptions) {
        this.reformattedOptions = newOptions.map(option => !option || !option.value ? {value: option} : option);
    }
}
