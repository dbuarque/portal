/**
 * Created by istrauss on 4/21/2016.
 */

import {customElement, bindingMode, bindable} from 'aurelia-framework';

/**
 *  Creates a single select
 * @element select-dd
 * @class SelectDDCustomElement
 */
@customElement('select-dd')
export class SelectDDCustomElement {

    /**
     * BINDABLE - Controls the single select's configuration.
     * @property {Object} config
     * @property {Object[]} options Array of option models for the single select.
     * @property {String} valueProp Optional (default: 'value') - Property of option model to bind the single select value to.
     * @property {String} labelProp Optional (default: 'label') - Property of option model to use when displaying the options to user.
     */
    @bindable config = {};

    /**
     * BINDABLE The options to display
     * @property {Array} options
     */
    @bindable options = [];

    /**
     * BINDABLE(default: twoWay) - the value to bind the single select result to.
     * @property {String} value
     */
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;

    @bindable disabled;

    optionsChanged() {
        if (this.mdSelect) {
            this.mdSelect.refresh();
        }
    }
}
