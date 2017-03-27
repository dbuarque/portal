/**
 * Created by istrauss on 3/17/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'resources';
import {ExchangeActionCreators} from '../exchange-action-creators';

@inject(AppStore, ExchangeActionCreators)
export class AssetPair {

    size = 16;

    constructor(appStore, exchangeActionCreators) {
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
        this.assetPair = {
            ...this.storedAssetPair
        };
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const exchange = this.appStore.getState().exchange;
        this.storedAssetPair = exchange.assetPair;
    }

    load() {
        const baseValid = this.baseAssetVm.validate();
        const counterValid = this.counterAssetVm.validate();
        if (!baseValid || !counterValid) {
            return;
        }

        if (this.assetPair.base.code === this.assetPair.counter.code && this.assetPair.base.issuer === this.assetPair.counter.issuer) {
            this.alertConfig = {
                type: 'error',
                message: 'Base and Counter assets must not have identical codes and issuers.'
            };
            return;
        }
        else {
            this.alertConfig = undefined;
        }

        this.appStore.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));
    }
}
