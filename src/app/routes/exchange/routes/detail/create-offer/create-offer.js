/**
 * Created by istrauss on 6/2/2017.
 */

import BigNumber from 'bignumber.js';
import {computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Store, connected} from 'au-redux';
import {TrustService, OfferService} from 'app-resources';
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
        else if (this.price <= 0 || parseFloat(this.buyingAmount, 10) <= 0 || parseFloat(this.sellingAmount, 10) <= 0) {
            alertMessage = 'Negative numbers are not allowed.';
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

        try {
            await this.offerService.createOffer({
                type: this.type,
                buyingCode: this.buyingAsset.code,
                buyingIssuer: this.buyingAsset.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.buyingAsset.issuer,
                sellingCode: this.sellingAsset.code,
                sellingIssuer: this.sellingAsset.code === window.lupoex.stellar.nativeAssetCode ? undefined : this.sellingAsset.issuer,
                sellingAmount: this.sellingAmount,
                price: this.price
            });

            this.detailActionCreators.updateMyOffers();
            this.detailActionCreators.updateMyAssetPair();
        }
        catch(e) {}
    }
}
