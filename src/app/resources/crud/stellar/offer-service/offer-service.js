/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, AlertToaster} from 'global-resources';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(StellarServer, ModalService, Store, AlertToaster, TransactionService)
export class OfferService {

    constructor(stellarServer, modalService, store, alertToaster, transactionService) {
        this.stellarServer = stellarServer;
        this.modalService = modalService;
        this.store = store;
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
        if (!this.store.getState().myAccount) {
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

        const options = {
            memo: this.stellarServer.sdk.Memo.Text('offer_via_lupoex')
        };

        await this.transactionService.submit(operations);
    }

    //Make sure account.sequence is updated before calling this method
    //or just call this method from the OfferService instead.
    async cancelOffer(offer) {
        const operations = [
            this.stellarServer.sdk.Operation.manageOffer({
                buying: offer.buying.asset_type === 'native' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(offer.buying.asset_code, offer.buying.asset_issuer),
                selling: offer.selling.asset_type === 'native' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(offer.selling.asset_code, offer.selling.asset_issuer),
                amount: '0',
                price: offer.price,
                offerId: offer.id
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
