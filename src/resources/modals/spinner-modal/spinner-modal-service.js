/**
 * Created by istrauss on 4/7/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {ModalService} from '../modal/modal-service';

@inject(ModalService)
export class SpinnerModalService {
    constructor(modalService) {
        this.modalService = modalService;
    }

    open(message, promise) {
        return this.modalService.open(PLATFORM.moduleName('resources/modals/spinner-modal/spinner-modal'), {message, promise}, {
            modalClass: 'spinner-modal',
            dismissible: false
        });
    }
}
