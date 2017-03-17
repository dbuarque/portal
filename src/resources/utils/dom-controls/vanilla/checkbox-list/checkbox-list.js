/**
 * Created by istrauss on 4/20/2016.
 */
import {customElement, bindable, bindingMode} from 'aurelia-framework';
import _find from 'lodash/find';

@customElement('checkbox-list')
export class CheckboxListCustomElement {

    @bindable config;
    @bindable options;
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;

    optionsChanged() {
        this.ensureValueIsAnArray();

        if (Array.isArray(this.options)) {
            this.checkboxList = this.options.map(option => {
                return {option: option, checked: this.valueIndexFromOption(option) > -1};
            });
        }

        this.value.forEach(valueItem => {
            let correspondingCheckbox = this.checkboxFromValue(valueItem);
            if (!correspondingCheckbox) {
                let valueIndex = this.value.indexOf(valueItem);
                this.removeFromValueByIndex(valueIndex);
            }
        });
    }

    valueChanged() {
        if (Array.isArray(this.value)) {
            this.value.forEach(this.checkOption.bind(this));
        }
    }

    checkboxSelected(evt) {
        this.ensureValueIsAnArray();

        let checkboxIndex = evt.target.value;
        let option = this.checkboxList[checkboxIndex].option;

        evt.target.checked ? this.addToValueByOption(option) : this.removeFromValueByOption(option);
    }

    ensureValueIsAnArray() {
        if (!Array.isArray(this.value)) {
            this.value = [];
        }
    }

    //remove an option's corresponding valueItem from the value array
    removeFromValueByOption(option) {
        let valueIndex = this.valueIndexFromOption(option);
        this.removeFromValueByIndex(valueIndex);
    }

    //add an option to the value array
    addToValueByOption(option) {
        this.value.push(this.optionValueFromOption(option));
    }

    //remove a valueItem from the value array
    removeFromValueByIndex(index) {
        this.value.splice(index, 1);
    }

    //get option's corresponding valueItem's index in value array
    valueIndexFromOption(option) {
        return this.value.indexOf(this.optionValueFromOption(option));
    }

    //get appropriate value from option to be put into value array
    optionValueFromOption(option) {
        return this.config.valueProp ? option[this.config.valueProp] : option;
    }

    //ensure a valueItem's corresponding option is checked
    checkOption(valueItem) {
        let correspondingCheckbox = this.checkboxFromValue(valueItem);
        correspondingCheckbox.checked = true;
    }

    //get a valueItem's corresponding checkbox from checkboxList
    checkboxFromValue(valueItem) {
        return _find(this.checkboxList, checkbox => {
            return this.config.valueProp ? checkbox.option[this.config.valueProp] === valueItem : checkbox.option === valueItem;
        });
    }
}
