/**
 * Created by istrauss on 4/7/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import ModalService from '../modal/modal-service';

@inject(ModalService)
export default class AlertModalService {
    constructor(modalService) {
        this.modalService = modalService;
    }
    open(type, message, options = {}) {
        let passedInfo = Object.assign({}, {type, message}, options);
        return this.modalService.open(PLATFORM.moduleName('resources/modals/alert-modal/alert-modal'), passedInfo, {
            modalClass: 'alert-modal',
            dismissible: !!options.confirm
        });
    }
}
