/**
 * Created by istrauss on 6/2/2017.
 */

import BigNumber from 'bignumber.js';
import {computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';
import {TrustService, OfferService, validStellarNumber} from 'app-resources';
import {DetailActionCreators} from '../detail-action-creators';

export class CreateOffer {

    @connected('myAccount')
    account;

    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.myAssetPair')
    myAssetPair;

    @computedFrom('buyingAsset')
    get needsTrustline() {
        return this.buyingAsset ? this.buyingAsset.code !== window.lupoex.stellar.nativeAssetCode : false;
    }

    @computedFrom('myBuyingAsset', 'buyingAmount')
    get minTrustLine() {
        return this.myBuyingAsset && this.myBuyingAsset.balance ? (new BigNumber(this.myBuyingAsset.balance)).plus(this.buyingAmount || 0).toString(10) : undefined;
    }
    
    constructor(container) {
        this.router = container.get(Router);
        this.store = container.get(Store);
        this.trustService = container.get(TrustService);
        this.offerService = container.get(OfferService);
        this.detailActionCreators = container.get(DetailActionCreators);
    }

    goToLogin() {
        this.router.parent.navigateToRoute('login');
    }

    async modifyLimit() {
        try {
            this.trustService.modifyLimit(this.buyingAsset.code, this.buyingAsset.issuer);
        }
        catch(e) {}
    }

    validate() {
        let alertMessage = undefined;
        if (!this.price) {
            alertMessage = 'Price is required';
        }
        else if (!this.buyingAmount) {
            alertMessage = this.assetPair.buying.code +  ' is required';
        }
        else if (!this.sellingAmount) {
            alertMessage = this.assetPair.selling.code +  ' is required';
        }
        else if (this.needsTrustline && parseFloat(this.myAssetPair.buying.limit, 10) < this.minTrustLine) {
            alertMessage = 'Trustline is too small. It must be at least ' + this.minTrustLine + ' to cover your balance and this new offer.';
        }
        else if (parseFloat(this.mySellingAsset.balance, 10) < parseFloat(this.sellingAmount, 10)) {
            alertMessage = 'You cannot spend ' + this.sellingAmount + ' ' + this.sellingAsset.code + ' as you only have ' + this.mySellingAsset.balance + ' ' + this.sellingAsset.code + ' in your account.';
        }

        this.alertConfig = alertMessage ? {
            type: 'error',
            message: alertMessage
        } : undefined;

        return !this.alertConfig
    }

    async submit() {
        if (!this.validate()) {
            return;
        }

        const price = this[this.type === 'bid' ? 'myBid' : 'myAsk'].price;

        try {
            await this.offerService.createOffer(
                this.type,
                this.sellingAmount,
                validStellarNumber(
                    (new BigNumber(price[0])).dividedBy(price[1])
                ),
                this.sellingAsset,
                this.buyingAsset
            );

            this.store.dispatch(
                this.detailActionCreators.updateMyOffers()
            );
            this.store.dispatch(
                this.detailActionCreators.updateMyAssetPair()
            );
        }
        catch(e) {}
    }
}
