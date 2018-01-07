/**
 * Created by istrauss on 5/8/2017.
 */

import BigNumber from 'bignumber.js';
import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import * as StellarSdk from 'stellar-sdk';
import {Store} from 'aurelia-redux-connect';
import {ModalService, AlertToaster} from 'global-resources';
import {validStellarNumber} from '../../../helpers';
import {AccountResource} from '../../resources';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(ModalService, Store, AlertToaster, AccountResource, TransactionService)
export class OfferService {

    constructor(modalService, store, alertToaster, accountResource, transactionService) {
        this.modalService = modalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.accountResource = accountResource;
        this.transactionService = transactionService;
    }

    /**
     * Initiates a payment
     * @param type
     * @param amount
     * @param price
     * @param sellingAsset
     * @param buyingAsset
     * @returns {*}
     */
    async createOffer(type, amount, price, sellingAsset, buyingAsset) {
        if (!this.store.getState().myAccount) {
            const errorMessage = 'You must be logged in to send a payment. Please log in and try again.';
            this.alertToaster.error(errorMessage);
            throw new Error(errorMessage);
        }

        // validStellarNumber() may lop off digits past 7 after the decimal.
        // In that case we want to specify rounding modes that will ensure that the offer fills a corresponding opposite offer
        price = validStellarNumber(price, {
            rm: BigNumber.ROUND_DOWN
        });

        await this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/offer-service/offer-modal/offer-modal'),
            {
                type,
                amount,
                price,
                sellingAsset,
                buyingAsset,
                title: 'Create Offer'
            },
            {
                modalClass: 'sm'
            }
        );

        const operations = [];

        try {
            const offerOp = StellarSdk.Operation.manageOffer({
                selling: sellingAsset.type.toLowerCase() === 'native' ?
                    StellarSdk.Asset.native() :
                    new StellarSdk.Asset(sellingAsset.code, sellingAsset.issuer.accountId || sellingAsset.issuer),
                buying: buyingAsset.type.toLowerCase() === 'native' ?
                    StellarSdk.Asset.native() :
                    new StellarSdk.Asset(buyingAsset.code, buyingAsset.issuer.accountId || buyingAsset.issuer),
                amount: validStellarNumber(amount),
                price
            });

            operations.push(offerOp);
        }
        catch (e) {
            this.alertToaster.error('Unexpected error occured. Please check your inputs. Your offer was NOT submitted to the network.');
            throw e;
        }

        await this.transactionService.submit(operations);
    }

    async cancelOffer(offer) {
        const operations = [
            StellarSdk.Operation.manageOffer({
                buying: offer.buyingAssetType.toLowerCase() === 'native' ?
                    StellarSdk.Asset.native() :
                    new StellarSdk.Asset(offer.buyingAssetCode, offer.buyingIssuerId),
                selling: offer.sellingAssetType.toLowerCase() === 'native' ?
                    StellarSdk.Asset.native() :
                    new StellarSdk.Asset(offer.sellingAssetCode, offer.sellingIssuerId),
                amount: '0',
                price: offer.price,
                offerId: offer.offerId
            })
        ];

        await this.transactionService.submit(operations);
    }
}
