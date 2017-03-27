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
    @bindable disabled;

    _config = {};

    constructor(element) {
        this.element = element;
    }

    configChanged() {
        this._config = {
            ...this._config,
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
                source: vm._config.source,
                open: function() {
                    $("ul.ui-menu").width( $(this).innerWidth() );

                    if (vm._config.open) {
                        vm._config.open()
                    }
                },
                select: function (event, ui) {
                    vm.value = ui.item.value;

                    if (vm._config.select) {
                        vm._config.select()
                    }
                },
                disabled: vm.disabled
            });
    }

    disabledChanged() {
        if (!this.$autocomplete) {
            return;
        }

        this.$autocomplete[this.disabled ? 'disable' : 'enable']();
    }

    optionsChanged() {
        if (!this.options) {
            return;
        }

        const newSource = this.options.map(o => {
            return {
                label: this._config.getLabel ? this._config.getLabel(o) : o[this._config.labelProp],
                value: this._config.getValue ? this._config.getValue(o) : o[this._config.valueProp]
            };
        });

        if (!this.$autocomplete) {
            this._config.source = newSource;
        }
        else {
            this.$autocomplete.autocomplete('option', 'source', newSource);
        }
    }
}
