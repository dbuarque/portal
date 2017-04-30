/**
 * Created by istrauss on 3/17/2017.
 */

import _cloneDeep from 'lodash/cloneDeep';
import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../exchange-action-creators';

@inject(AppStore, ExchangeActionCreators)
export class AssetPairCustomElement {

    size = 16;

    constructor(appStore, exchangeActionCreators) {
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const exchange = this.appStore.getState().exchange;

        if (this.storedAssetPair !== exchange.assetPair) {
            this.storedAssetPair = exchange.assetPair;
            this.assetPair = _cloneDeep(this.storedAssetPair);
        }
    }

    load() {
        const sellingValid = this.sellingAssetVm.validate();
        const buyingValid = this.buyingAssetVm.validate();
        if (!sellingValid || !buyingValid) {
            return;
        }

        if (this.assetPair.selling.code === this.assetPair.buying.code && this.assetPair.selling.issuer === this.assetPair.buying.issuer) {
            this.alertConfig = {
                type: 'error',
                message: 'Selling and Buying assets must not have identical codes and issuers.'
            };
            return;
        }
        else {
            this.alertConfig = undefined;
        }

        this.appStore.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));
    }
}
