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
            memo: this.stellarServer.sdk.Memo.text('offer_via_lupoex')
        };

        await this.transactionService.submit(operations, options);
    }

    async cancelOffer(offer) {
        const operations = [
            this.stellarServer.sdk.Operation.manageOffer({
                buying: offer.buyingAssetType.toLowerCase() === 'native' ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(offer.buyingAssetCode, offer.buyingIssuerId),
                selling: offer.sellingAssetType.toLowerCase() === 'native' ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(offer.sellingAsseCode, offer.sellingIssuerId),
                amount: '0',
                price: offer.price,
                offerId: offer.offerId
            })
        ];

        await this.transactionService.submit(operations);
    }
}
