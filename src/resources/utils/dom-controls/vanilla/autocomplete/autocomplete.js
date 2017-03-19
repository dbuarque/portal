/**
 * Created by istrauss on 3/17/2017.
 */

import {inject, bindable, bindingMode} from 'aurelia-framework';

const defaultConfig = {
    labelProp: 'label',
    valueProp: 'value'
};

@inject(Element)
export class AutocompleteCustomElement {

    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
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

    valueChanged() {
        if (this.$autocomplete) {
            this.$autocomplete.val(this.value);
        }
    }

    attached() {
        const vm = this;
        vm.$autocomplete = $(vm.element).find('.autocomplete');

        vm.$autocomplete
            .autocomplete({
                source: vm.options.map(o => {
                    return {
                        label: vm.config.getLabel ? vm.config.getLabel(o) : o[vm.config.labelProp],
                        value: vm.config.getValue ? vm.config.getValue(o) : o[vm.config.valueProp]
                    };
                }),
                open: function() {
                    $("ul.ui-menu").width( $(this).innerWidth() );
                },
                select: function (event, ui) {
                    vm.value = ui.item.value;
                }
            });
    }
}
