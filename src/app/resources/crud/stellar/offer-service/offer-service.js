/**
 * Created by istrauss on 5/8/2017.
 */

import BigNumber from 'bignumber.js';
import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {StellarServer, ModalService, AlertToaster} from 'global-resources';
import {validStellarNumber} from '../../../helpers';
import {AccountResource} from '../../resources';
import {TransactionService} from '../transaction-service/transaction-service';

@inject(StellarServer, ModalService, Store, AlertToaster, AccountResource, TransactionService)
export class OfferService {

    constructor(stellarServer, modalService, store, alertToaster, accountResource, transactionService) {
        this.stellarServer = stellarServer;
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
            rm: type === 'bid' ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN
        });

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
        
        const operations = [];

        try {
            const nativeAssetCode = window.lupoex.stellar.nativeAssetCode;
            //const fee = await this.calculateFee(amount, sellingAsset);
            //const sellingAmount = (new BigNumber(amount)).minus(fee).toFixed(7);

            const offerOp = this.stellarServer.sdk.Operation.manageOffer({
                selling: sellingAsset.code === nativeAssetCode ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(sellingAsset.code, sellingAsset.issuer),
                buying: buyingAsset.code === nativeAssetCode ?
                    this.stellarServer.sdk.Asset.native() :
                    new this.stellarServer.sdk.Asset(buyingAsset.code, buyingAsset.issuer),
                amount: validStellarNumber(amount),
                price
            });

            operations.push(offerOp);

            //Comment this back in to enable fees
            // if (fee && fee > 0) {
            //     const feePaymentOp = this.stellarServer.sdk.Operation.payment({
            //         destination: window.lupoex.publicKey,
            //         asset: sellingAsset.code === nativeAssetCode ?
            //             this.stellarServer.sdk.Asset.native() :
            //             new this.stellarServer.sdk.Asset(sellingAsset.code, sellingAsset.issuer),
            //         amount: fee.toString()
            //     });
            //
            //     operations.push(feePaymentOp);
            // }
        }
        catch(e) {
            this.alertToaster.error('Unexpected error occured. Please check your inputs. Your offer was NOT submitted to the network.');
            console.log(JSON.stringify(e));
            throw e;
        }

        //const options = {
        //    memo: this.stellarServer.sdk.Memo.text('offer_via_lupoex')
        //};

        await this.transactionService.submit(operations, options);
    }

    async calculateFee(amount, asset) {
        if (!window.lupoex.offerFeeFactor) {
            return 0;
        }

        const lupoexHasTrust = asset.code === window.lupoex.stellar.nativeAssetCode ?
            true :
            await this.accountResource.trustline(window.lupoex.publicKey, asset);

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
