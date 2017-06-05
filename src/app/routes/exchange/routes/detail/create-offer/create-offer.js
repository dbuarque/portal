/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash.debounce';
import {bindable, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppStore} from 'global-resources';

export class CreateOffer {

    trustlineExplanation = 'The stellar network will only allow you to create an offer for an asset if you first enable a trustline for it. ' +
        'This prevents users from inadvertently trading an asset that they do not trust. Your trustline must be equal to or greater than your current balance plus any active offers you have for an asset.';
    
    constructor(container) {
        this.router = container.get(Router);
        this.appStore = container.get(AppStore);

        this.priceChanged = _debounce(this._priceChanged.bind(this), 250);
        this.buyingAmountChanged = _debounce(this._buyingAmountChanged.bind(this), 250);
        this.sellingAmountChanged = _debounce(this._sellingAmountChanged.bind(this), 250);
        this.trustlineChanged = _debounce(this._trustlineChanged.bind(this), 250);
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

        this.account = state.account;
        this.assetPair = state.exchange.assetPair;

        if (this.allOffers !== state.offers && this.filterOffers) {
            this.allOffers = state.offers;
            this.offers = this.filterOffers(this.allOffers);
        }
    }

    goToLogin() {
        this.router.parent.navigateToRoute('login');
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
        else if (parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10) - parseFloat(this.buyingAmount, 10) > 0.00000001) {
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
        
        if (this.sellingAmount) {
            this.buyingAmount = parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10);
        }
        else if (this.buyingAmount) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / parseFloat(this.price, 10);
        }

        this.autoCalculateTrustline();
    }
    
    _buyingAmountChanged() {
        if (!this.buyingAmount) {
            return;
        }
        
        if (this.price) {
            this.sellingAmount = parseFloat(this.buyingAmount, 10) / parseFloat(this.price, 10);
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
        }
        else if (this.buyingAmount) {
            this.price = parseFloat(this.buyingAmount, 10) / parseFloat(this.sellingAmount, 10);
        }

        this.autoCalculateTrustline();
    }

    get buyingAssetOffersAmount() {
        return this.offers ? this.offers.reduce((result, o) => {
            const add = this.compareAssets(this.buyingAsset, o.buying) ?
                parseFloat(o.amount, 10) * parseFloat(o.price, 10) :
                parseFloat(o.amount, 10);

            return result + add;
        }, 0) : 0;
    }

    autoCalculateTrustline() {
        if (this.trustlineManuallySet || !this.needsTrustline) {
            return;
        }

        this.trustline = this.minimumTrustline();
    }

    minimumTrustline() {
        if (!this.buyingAmount || !this.sellingAmount || !this.price) {
            return;
        }

        return Math.ceil(parseFloat(this.buyingAssetBalance, 10) + parseFloat(this.buyingAmount, 10) + this.buyingAssetOffersAmount);
    }

    refresh() {
        this.price = undefined;
        this.sellingAmount = undefined;
        this.buyingAmount = undefined;
        this.trustline = undefined;
    }

    compareAssets(asset1, asset2) {
        return (asset1.asset_type === 'native' && asset2.code === window.lupoex.stellar.nativeAssetCode) ||
            (asset1.asset_code === asset2.code && asset1.asset_issuer === asset2.issuer);
    }

    _trustlineChanged() {
        this.trustlineManuallySet = true;
    }
}
