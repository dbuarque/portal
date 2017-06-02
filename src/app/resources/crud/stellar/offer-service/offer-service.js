/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {ModalService, AppStore, AlertToaster} from 'global-resources';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(ModalService, AppStore, AlertToaster, TransactionService)
export class OfferService {

    constructor(modalService, appStore, alertToaster, transactionService) {
        this.modalService = modalService;
        this.appStore = appStore;
        this.alertToaster = alertToaster;
        this.transactionService = transactionService;
    }

    /**
     * Initiates a payment
     * @param [passedInfo]
     * @param [passedInfo.sellingCode]
     * @param [passedInfo.buyingCode]
     * @param [passedInfo.sellingAmount]
     * @param [passedInfo.price]
     * @param [passedInfo.issuer]
     * @returns {*}
     */
    async createOffer(passedInfo) {
        if (!this.appStore.getState().account) {
            const errorMessage = 'You must be logged in to send a payment. Please log in and try again.';
            this.alertToaster.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            const transaction = await this.modalService.open(PLATFORM.moduleName('app/resources/crud/offer-service/offer-modal/offer-modal'),
                {
                    ...passedInfo,
                    title: 'Create Offer'
                }
            );

            await this.transactionService.submitTransaction(transaction);
        }
        catch(e) {}
    }
}
