/**
 * Created by istrauss on 6/8/2016.
 */

import {inject, bindable, customElement, bindingMode} from 'aurelia-framework';
import _debounce from 'lodash/debounce';

const defaultConfig = {
    autogrow: true,
    btns: [
        ['formatting'],
        'btnGrp-semantic',
        ['superscript', 'subscript'],
        ['link'],
        'btnGrp-justify',
        'btnGrp-lists',
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
    ]
};

@customElement('wysiwyg')
@inject(Element)
export class WysiwygCustomElement {

    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable disabled = false;
    @bindable config;

    constructor(element) {
        this.element = element;

        this.$element = $(element);
    }

    bind() {
        this._config = Object.assign({}, defaultConfig, this.config, {disabled: this.disabled});
    }

    attached() {
        let vm = this;


        vm.$textArea = vm.$element.find('textarea')
            .trumbowyg(this._config)
            .on('tbwchange', _debounce(function() {
                vm.value = vm.$textArea.trumbowyg('html');
            }, 250));
        vm.valueChanged();
    }

    detached() {
        if (this.$textArea) {
            this.$element.off('tbwchange');
            this.$textArea.trumbowyg('destroy');
        }
    }

    valueChanged() {
        if (this.$textArea && this.value !== this.$textArea.trumbowyg('html')) {
            this.$textArea.trumbowyg('html', this.value);
        }
    }
}
