/**
 * Created by istrauss on 4/7/2016.
 */

import {inject} from 'aurelia-framework';
import ModalService from '../modal/modal-service';

@inject(ModalService)
export default class SpinnerModalService {
    constructor(modalService) {
        this.modalService = modalService;
    }

    open(message, promise) {
        return this.modalService.open('resources/modals/spinner-modal/spinner-modal', {message, promise}, {
            modalClass: 'spinner-modal',
            dismissible: false
        });
    }
}
