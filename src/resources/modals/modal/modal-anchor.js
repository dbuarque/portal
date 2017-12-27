/**
 * Created by istrauss on 5/4/2016.
 */

import {inject, bindable, customElement} from 'aurelia-framework';
import _findIndex from 'lodash/findIndex';
import {ModalService} from './modal-service';

@customElement('modal-anchor')
@inject(ModalService)
export class ModalAnchorCustomElement {
    @bindable config;

    constructor(modalService) {
        this.modalService = modalService;
        this.modalInstructions = [];

        this.modalService.subscribe(this.modalEventHandler.bind(this))
    }

    modalEventHandler(params) {
        if (params.event === 'opened') {
            this.modalOpened(params.modalId);
        }
        else if (params.event === 'closed') {
            this.modalClosed(params.modalId);
        }
    }

    modalOpened(modalId) {
        this.modalInstructions.push(this.modalService.getInstruction(modalId));
        $('body').addClass('modal-open');
    }

    modalClosed(modalId) {
        const index = _findIndex(this.modalInstructions, {modalId});
        this.modalInstructions.splice(index, 1);
        if (this.modalInstructions.length === 0) {
            $('body').removeClass('modal-open');
        }
    }
}
