/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {ModalService, AppStore, AlertToaster} from 'global-resources';

@inject(ModalService, AppStore, AlertToaster)
export class PaymentService {

    constructor(modalService, appStore, alertToaster) {
        this.modalService = modalService;
        this.appStore = appStore;
        this.alertToaster = alertToaster;
    }

    initiatePayment(passedInfo) {
        if (!this.appStore.getState().account) {
            const errorMessage = 'You must be logged in to send a payment. Please log in and try again.';
            this.alertToaster.error(errorMessage);
            throw new Error(errorMessage);
        }
        return this.modalService.open(PLATFORM.moduleName('app-resources/crud/payment-service/payment-modal/payment-modal'), passedInfo);
    }
}
