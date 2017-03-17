/**
 * Created by istrauss on 5/4/2016.
 */

import {inject, bindable, customElement} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import _findIndex from 'lodash/findIndex';
import ModalService from './modal-service';

@customElement('modal-anchor')
@inject(EventAggregator, ModalService)
export class ModalAnchorCustomElement {

    @bindable config;

    constructor(eventAggregator, modalService) {
        this.eventAggregator = eventAggregator;
        this.modalService = modalService;
        this.modalInstructions = [];

        this.addListeners();
    }

    addListeners() {
        this.eventAggregator.subscribe('modal.open', (modalId) => {
            this.modalInstructions.push(this.modalService.getInstruction(modalId));
        });

        this.eventAggregator.subscribe('modal.destroy', (modalId) => {
            this.modalInstructions.splice(_findIndex(this.modalInstructions, {modalId: modalId}), 1);
        });
    }
}
