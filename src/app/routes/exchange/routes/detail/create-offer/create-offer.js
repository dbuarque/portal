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
            await this.trustService.modifyLimit(this.buyingAsset.code, this.buyingAsset.issuer);
        }
        catch(e) {}
    }

    validate() {
        let alertMessage = undefined;
        if (!this.price) {
            alertMessage = 'Price is required';
        }
        else if (!this.buyingAmount) {
            alertMessage = this.buyingAsset.code +  ' is required';
        }
        else if (!this.sellingAmount) {
            alertMessage = this.sellingAsset.code +  ' is required';
        }
        else if (this.needsTrustline && parseFloat(this.myBuyingAsset.limit, 10) < this.minTrustLine) {
            alertMessage = 'Trustline is too small. It must be at least ' + this.minTrustLine + ' to cover your balance and this new offer.';
        }
        else if (!this.mySellingAsset.balance || parseFloat(this.mySellingAsset.balance, 10) < parseFloat(this.sellingAmount, 10)) {
            alertMessage = 'You cannot spend ' + this.sellingAmount + ' ' + this.sellingAsset.code + ' as you only have ' + (this.mySellingAsset.balance || 0) + ' ' + this.sellingAsset.code + ' in your account.';
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
                    (new BigNumber(price[0])).dividedBy(price[1]),
                    {
                        // validStellarNumber() may lop off digits past 7 after the decimal.
                        // In that case we want to specify rounding modes that will ensure that the offer fills a corresponding opposite offer
                        rm: this.type === 'bid' ?
                            BigNumber.ROUND_UP :
                            BigNumber.ROUND_DOWN
                    }
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
