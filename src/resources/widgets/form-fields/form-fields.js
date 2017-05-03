/**
 * Created by istrauss on 3/30/2016.
 */

import _get from 'lodash.get';
import _cloneDeep from 'lodash.clonedeep';
import {inject, customElement, bindable, bindingMode, containerless} from 'aurelia-framework';
import {ObserverManager, ObservationInstruction} from '../../workers/workers';

@customElement('form-fields')
@containerless()
@inject(ObserverManager)
export class FormFieldsCustomElement {
    @bindable config = {};
    @bindable validationManager;
    @bindable({defaultBindingMode: bindingMode.twoWay}) model;

    formFields = [];

    constructor(observerManager) {
        this.observerManager = observerManager;
    }

    bind() {
        this.subscribeObservers();
        this.refreshFormFields();
    }

    unbind() {
        this.observerManager.unsubscribe();
    }

    subscribeObservers() {
        const instructions = [
            new ObservationInstruction(this.config, 'fields', this.refreshFormFields.bind(this))
        ];

        this.observerManager.subscribe(instructions);
    }

    configChanged() {
        this.refreshFormFields();
    }

    modelChanged() {
        this.refreshFormFields();
    }

    refreshFormFields() {
        this.config.fields = this.config.fields || {};

        this.formFields = Object.keys(this.config.fields).map(key => {
            const splitKey = key.split('.');
            let model;
            let property;
            if (splitKey.length === 1) {
                model = this.model;
                property = splitKey[0];
            }
            else {
                model = _get(this.model, splitKey.slice(0, splitKey.length - 1).join('.'));
                property = splitKey[splitKey.length - 1];
            }

            Object.assign(this.config.fields[key], {model, property, formKey: key});

            return this.config.fields[key];
        });
    }
}
