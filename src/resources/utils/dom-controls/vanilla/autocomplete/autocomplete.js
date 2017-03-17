/**
 * Created by istrauss on 3/17/2017.
 */

import {inject, bindable} from 'aurelia-framework';

const defaultConfig = {
    labelProp: 'label',
    valueProp: 'value'
};

@inject(Element)
export class AutocompleteCustomElement {

    @bindable value;
    @bindable config;
    @bindable options;

    constructor(element) {
        this.element = element;
    }

    configChanged() {
        this._config = {
            ...defaultConfig,
            ...this.config
        };
    }

    attached() {
        $(this.element)
            .find('.autocomplete')
            .autocomplete({
                data: options.reduce((map, o) => {
                    const label = this.config.getLabel ? this.config.getLabel(o) : o[this.config.labelProp];
                    const value = this.config.getValue ? this.config.getValue(o) : o[this.config.valueProp];

                    map[label] = value;

                    return map;
                })
            });
    }
}
