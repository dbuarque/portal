/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import {bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
 import {Store} from 'au-redux';
import {TrustService} from 'app-resources';

export class CreateOffer {
    
    constructor(container) {
        this.router = container.get(Router);
        this.store = container.get(Store);
        this.trustService = container.get(TrustService);

        this.onPriceChanged = _debounce(this.priceChanged.bind(this), 250);
        this.onBuyingAmountChanged = _debounce(this.buyingAmountChanged.bind(this), 250);
        this.onSellingAmountChanged = _debounce(this.sellingAmountChanged.bind(this), 250);
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.store.getState();

        if (this.assetPair !== state.exchange.assetPair || this.account !== state.account) {
            this.account = state.account;
            this.assetPair = state.exchange.assetPair;
            this.buyingAssetBalance = this.trustService.balance(this.buyingAsset.code, this.buyingAsset.issuer) || {limit: 0, balance: 0};
            this.sellingAssetBalance = this.trustService.balance(this.sellingAsset.code, this.sellingAsset.issuer) || {limit: 0, balance: 0};

            this.buyingAssetBalance.balance = parseFloat(this.buyingAssetBalance.balance, 10);
            this.buyingAssetBalance.limit = parseFloat(this.buyingAssetBalance.limit, 10);
            this.sellingAssetBalance.balance = parseFloat(this.sellingAssetBalance.balance, 10);
            this.sellingAssetBalance.limit = parseFloat(this.sellingAssetBalance.limit, 10);

            this.autoCalculateTrustline();
        }
    }

    get needsTrustline() {
        return this.buyingAsset.code !== window.lupoex.stellar.nativeAssetCode;
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
        if (!this.sellingPrice) {
            alertMessage = 'Price is required';
        }
        else if (!this.buyingAmount) {
            alertMessage = this.assetPair.buying.code +  ' is required';
        }
        else if (!this.sellingAmount) {
            alertMessage = this.assetPair.selling.code +  ' is required';
        }
        else if (this.sellingPrice * parseFloat(this.sellingAmount, 10) - parseFloat(this.buyingAmount, 10) > 0.00000009) {
            alertMessage = this.assetPair.buying.code +  ' must equal '  + this.assetPair.selling.code + ' multiplied by the price';
        }
        else if (this.sellingPrice <= 0 || parseFloat(this.buyingAmount, 10) <= 0 || parseFloat(this.sellingAmount, 10) <= 0) {
            alertMessage = 'Negative numbers are not allowed.';
        }
        else if (this.needsTrustline && parseFloat(this.trustline, 10) < this.minimumTrustline()) {
            alertMessage = 'Trustline is too small. It must be at least ' + this.minimumTrustline() + ' to cover your balance and this new offer.';
        }
        else if (parseFloat(this.sellingAssetBalance, 10) < parseFloat(this.sellingAmount, 10)) {
            alertMessage = 'You cannot spend ' + this.sellingAmount + ' ' + this.sellingAsset.code + ' as you only have ' + this.sellingAssetBalance + ' ' + this.sellingAsset.code + ' in your account.';
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
                price: this.sellingPrice
            });

            this.store.dispatch(this.exchangeActionCreators.refreshOrderbook());
        }
        catch(e) {}
    }
    
    priceChanged() {
        if (!this.sellingPrice) {
            return;
        }

        if (this.buyingAmount) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / this.sellingPrice;
            this.sellingAmount = this.sellingAmount.toFixed(7);
        }
        else if (this.sellingAmount) {
            this.buyingAmount = this.sellingPrice * parseFloat(this.sellingAmount, 10);
            this.buyingAmount = this.buyingAmount.toFixed(7);
        }

        this.autoCalculateTrustline();
    }
    
    buyingAmountChanged() {
        if (!this.buyingAmount) {
            return;
        }

        if (this.sellingPrice) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / this.sellingPrice;
            this.sellingAmount = this.sellingAmount.toFixed(7);
        }
        else if (this.sellingAmount) {
            this.sellingPrice = parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10);
        }
        this.autoCalculateTrustline();
    }

    sellingAmountChanged() {
        if (!this.sellingAmount) {
            return;
        }
        
        if (this.sellingPrice) {
            this.buyingAmount = this.sellingPrice * parseFloat(this.sellingAmount, 10);
            this.buyingAmount = this.buyingAmount.toFixed(7);
        }
        else if (this.buyingAmount) {
            this.sellingPrice = parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10);
        }

        this.autoCalculateTrustline();
    }

    autoCalculateTrustline() {
        if (!this.needsTrustline) {
            return;
        }

        this.minTrustLine = this.minimumTrustline();
    }

    minimumTrustline() {
        const minTrust = this.buyingAssetBalance.balance + parseFloat(this.buyingAmount || 0, 10);
        return minTrust.toFixed(7);
    }

    refresh() {
        this.price = undefined;
        this.sellingAmount = undefined;
        this.buyingAmount = undefined;
        this.trustline = undefined;
    }
}
