/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {StellarServer, ModalService, AppStore, AlertToaster} from 'global-resources';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(StellarServer, ModalService, AppStore, AlertToaster, TransactionService)
export class BaseOfferService {

    constructor(stellarServer, modalService, appStore, alertToaster, transactionService) {
        this.stellarServer = stellarServer;
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

        const operations = await this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/offer-service/offer-modal/offer-modal'),
            {
                ...passedInfo,
                title: 'Create Offer'
            }
        );

        await this.transactionService.submit(operations);
    }

    //Make sure account.sequence is updated before calling this method
    //or just call this method from the OfferService instead.
    async cancelOffer(offerId) {
        const operations = [
            this.stellarServer.sdk.Operation.manageOffer({
                amount: 0,
                offerId
            })
        ];

        await this.transactionService.submit(operations);
    }

    async allOffers(accountId, page) {
        page = page ? await page.next() : await this.stellarServer.offers('accounts', accountId).limit(100).call();
        let records = page.records;

        if (page.records === 100) {
            const moreRecords = await this.allOffers(accountId, page);

            records = records.concat(moreRecords);
        }

        return records;
    }
}
