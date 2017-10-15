/**
 * Created by istrauss on 4/7/2016.
 */

import {inject, TemplatingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import _uniqueId from 'lodash/uniqueId';

const defaultModalOptions = {
    keyboard: false,
    backdrop: 'static',
    dismissible: true
};

@inject(TemplatingEngine, EventAggregator)
export default class ModalService {

    constructor(templatingEngine, eventAggregator) {
        this.templatingEngine = templatingEngine;
        this.eventAggregator = eventAggregator;
        this.modalInstructions = {};
    }

    addListeners() {
        this.eventAggregator.subscribe('modal.destroy', (modalId) => {
            delete this.modalInstructions[modalId];
        });
    }

    open(path, passedInfo, options = {}) {
        return new Promise((resolve, reject) => {
            options = Object.assign({}, defaultModalOptions, options);

            let modalId = _uniqueId();

            this.modalInstructions[modalId] = {path, passedInfo, resolve, options, modalId};

            this.eventAggregator.publish('modal.open', modalId);
        });
    }

    getInstruction(modalId) {
        return this.modalInstructions[modalId];
    }
}
