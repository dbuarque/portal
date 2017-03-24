/**
 * Created by istrauss on 3/17/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'resources';
import {ExchangeActionCreators} from '../exchange-action-creators';
import Config from './asset-pair-config';

@inject(Config, AppStore, ExchangeActionCreators)
export class AssetPair {
    constructor(config, appStore, exchangeActionCreators) {
        this.config = config;
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
        if (!this.baseAssetVm.validate() || !this.counterAssetVm.validate()) {
            return;
        }

        this.appStore.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));
    }
}
