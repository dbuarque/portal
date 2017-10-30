 /**
 * Created by ISHAI-NOTEBOOK on 7/6/2016.
 */

import {inject, bindable, customElement, TaskQueue, bindingMode} from 'aurelia-framework';
import {EventHelper} from '../../../helpers';

@customElement('select2')
@inject(Element, TaskQueue)
export class Select2CustomElement {

    @bindable config = {};
    @bindable options = [];
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable disabled;

    constructor(element, taskQueue) {
        this.element = element;
        this.$element = $(element);
        this.taskQueue = taskQueue;
    }

    attached() {
        const vm = this;

        vm.config.dropdownParent = vm.$element.find('.select2-custom-element');
        vm.$select = vm.$element.find('select');


        if (vm.config.ajax) {
            if (!vm.config.ajax.processResults) {
                vm.config.ajax.processResults = (data, params) => {
                    data.results = data.results.map(vm.getFormattedOption.bind(vm));
                    return data;
                };
            }
        }

        vm.$select
            .on('change', (event) => {
                const selectValue = this.$select.val() || this.config.placeholderValue;
                const modelValue = this.value;

                if (modelValue !== selectValue) {
                    this.value = selectValue;
                    EventHelper.emitEvent(vm.element, 'choose', {
                        detail: {
                            value: selectValue
                        },
                        bubbles: true
                    });
                }
            })
            .select2(vm.config);

        vm.optionsChanged();
        vm.disabledChanged();
    }

    disabledChanged() {
        if (this.$select) {
            this.$select.prop('disabled', this.disabled);
        }
    }

    optionsChanged() {
        if (!this.$select || !this.options) {
            return;
        }

        this.formattedOptions = this.options.map(this.getFormattedOption.bind(this));

        this.taskQueue.queueTask(function() {
            if (this.$select) {
                this.$select.select2('destroy').select2(this.config);

                if (this.value) {
                    this.valueChanged();
                }
            }
        }.bind(this));
    }

    getFormattedOption(option) {
        return {
            id: this.config.getId ? this.config.getId(option) : option[this.config.idProp || 'id'],
            text: this.config.getText ? this.config.getText(option) : option[this.config.textProp || 'text']
        };
    }

    valueChanged() {
        if (!this.$select) {
            return;
        }

        const selectValue = this.$select.val();
        const modelValue = this.value || "";

        if (selectValue !== modelValue && this.options && this.options.length > 0) {
            this.$select.val(modelValue);

            //Value wasn't set because option does not exist
            if (this.$select.val() !== modelValue) {
                this.formattedOptions = modelValue ? [
                    {
                        id: modelValue,
                        text: modelValue
                    }
                ] : [];

                this.taskQueue.queueTask(() => {
                    this.$select.val(modelValue);
                });
            }

            this.taskQueue.queueTask(() => {
                this.$select.trigger('change');
            });
        }
    }
}
