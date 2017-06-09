/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import {bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {TrustService} from 'app-resources';

export class CreateOffer {
    
    constructor(container) {
        this.router = container.get(Router);
        this.appStore = container.get(AppStore);
        this.trustService = container.get(TrustService);

        this.priceChanged = _debounce(this._priceChanged.bind(this), 250);
        this.buyingAmountChanged = _debounce(this._buyingAmountChanged.bind(this), 250);
        this.sellingAmountChanged = _debounce(this._sellingAmountChanged.bind(this), 250);
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.appStore.getState();

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
        if (!this.price) {
            alertMessage = 'Price is required';
        }
        else if (!this.buyingAmount) {
            alertMessage = this.assetPair.buying.code +  ' is required';
        }
        else if (!this.sellingAmount) {
            alertMessage = this.assetPair.selling.code +  ' is required';
        }
        else if (parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10) - parseFloat(this.buyingAmount, 10) > 0.00000009) {
            alertMessage = this.assetPair.buying.code +  ' must equal '  + this.assetPair.selling.code + ' multiplied by the price';
        }
        else if (parseFloat(this.price, 10) <= 0 || parseFloat(this.buyingAmount, 10) <= 0 || parseFloat(this.sellingAmount, 10) <= 0) {
            alertMessage = 'Negative numbers are not allowed.';
        }
        else if (this.price.length > 15 || this.sellingAmount.length > 15 || this.buyingAmount.length > 15) {
            alertMessage = 'Numbers with more than 15 digits are not allowed.';
        }
        else if (this.needsTrustline && parseFloat(this.trustline, 10) < this.minimumTrustline()) {
            alertMessage = 'Trustline is too small. It must be at least ' + this.minimumTrustline() + ' to cover your balance, current offers and this new offer.';
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
    
    _priceChanged() {
        if (!this.price) {
            return;
        }

        if (this.buyingAmount) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / parseFloat(this.price, 10);
            this.sellingAmount = this.sellingAmount.toFixed(7);
        }
        else if (this.sellingAmount) {
            this.buyingAmount = parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10);
            this.buyingAmount = this.buyingAmount.toFixed(7);
        }

        this.autoCalculateTrustline();
    }
    
    _buyingAmountChanged() {
        if (!this.buyingAmount) {
            return;
        }

        if (this.price) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / parseFloat(this.price, 10);
            this.sellingAmount = this.sellingAmount.toFixed(7);
        }
        else if (this.sellingAmount) {
            this.price = parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10);
        }
        this.autoCalculateTrustline();
    }

    _sellingAmountChanged() {
        if (!this.sellingAmount) {
            return;
        }
        
        if (this.price) {
            this.buyingAmount = parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10);
            this.buyingAmount = this.buyingAmount.toFixed(7);
        }
        else if (this.buyingAmount) {
            this.price = parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10);
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
