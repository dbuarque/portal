/**
 * Created by istrauss on 5/8/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, AlertToaster} from 'global-resources';
import {validStellarNumber} from 'app-resources';
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

        await this.modalService.open(PLATFORM.moduleName('app/resources/crud/stellar/offer-service/offer-modal/offer-modal'),
            {
                type,
                amount,
                price,
                sellingAsset,
                buyingAsset,
                title: 'Create Offer'
            }
        );

        const fee = await this.calculateFee(this.sellingAmount, {
            code: this.passedInfo
        });
        const sellingAmount = (new BigNumber(this.sellingAmount)).minus(this.fee).toFixed(7);
        const operations = [];

        try {
            const offerOp = this.stellarServer.sdk.Operation.manageOffer({
                selling: this.sellingCode === this.nativeAssetCode ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(sellingAsset.code, sellingAsset.issuer),
                buying: this.buyingCode === this.nativeAssetCode ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(buyingAsset.code, buyingAsset.issuer),
                amount: validStellarNumber(amount),
                price: validStellarNumber(price)
            });

            operations.push(offerOp);

            if (fee && fee > 0) {
                const feePaymentOp = this.stellarServer.sdk.Operation.payment({
                    destination: window.lupoex.publicKey,
                    asset: this.sellingCode === this.nativeAssetCode ?
                        this.stellarServer.sdk.Asset.native() :
                        new this.stellarServer.sdk.Asset(sellingAsset.code, sellingAsset.issuer),
                    amount: fee.toString()
                });

                operations.push(feePaymentOp);
            }
        }
        catch(e) {
            this.alertToaster.error('Unexpected error occured. Please check your inputs. Your offer was NOT submitted to the network.');
            throw e;
        }

        const options = {
            memo: this.stellarServer.sdk.Memo.text('offer_via_lupoex')
        };

        await this.transactionService.submit(operations, options);
    }

    async calculateFee(amount, asset) {
        if (window.lupoex.env !== 'production' || !window.lupoex.offerFeeFactor) {
            return 0;
        }

        const lupoexHasTrust = await this.accountResource.trustline(window.lupoex.publicKey, asset);

        if (!lupoexHasTrust) {
            return 0;
        }

        const feeString = (new BigNumber(amount)).times(window.lupoex.offerFeeFactor).toFixed(7);

        return parseFloat(feeString, 10);
    }

    async cancelOffer(offer) {
        const operations = [
            this.stellarServer.sdk.Operation.manageOffer({
                buying: offer.buyingAssetType.toLowerCase() === 'native' ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(offer.buyingAssetCode, offer.buyingIssuerId),
                selling: offer.sellingAssetType.toLowerCase() === 'native' ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(offer.sellingAssetCode, offer.sellingIssuerId),
                amount: '0',
                price: offer.price,
                offerId: offer.offerId
            })
        ];

        await this.transactionService.submit(operations);
    }
}
