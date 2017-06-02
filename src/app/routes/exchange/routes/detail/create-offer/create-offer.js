/**
 * Created by istrauss on 6/2/2017.
 */

import _debounce from 'lodash/debounce';
import {bindable, inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';

export class CreateOfferCustomElement {
    @bindable type;
    
    constructor() {
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

        this.account = state.account;
        this.assetPair = state.exchange.assetPair;
    }

    submit() {
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
        else if (parseFloat(this.buyingAmount, 10) !== parseFloat(this.price, 10) * parseFloat(this.sellingAmount, 10)) {
            alertMessage = this.assetPair.buying.code +  ' must equal '  + this.assetPair.selling.code + ' multiplied by the price';
        }

        this.alertConfig = alertMessage ? {
            type: 'eror',
            message: alertMessage
        } : undefined;


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
    }
}
