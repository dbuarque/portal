/**
 * Created by istrauss on 3/17/2017.
 */

import _cloneDeep from 'lodash/cloneDeep';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {EventHelper} from 'global-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';

@inject(Element, Store, ExchangeActionCreators)
export class SearchAssetsCustomElement {

    loading = 0;
    size = 16;

    constructor(element, store, exchangeActionCreators) {
        this.element = element;
        this.store = store;
        this.exchangeActionCreators = exchangeActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const exchange = this.store.getState().exchange;

        if (this.storedAssetPair !== exchange.assetPair) {
            this.storedAssetPair = exchange.assetPair;
            this.assetPair = _cloneDeep(this.storedAssetPair);
        }
    }

    async load() {
        this.loading++;

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

        await this.store.dispatch(this.exchangeActionCreators.updateAssetPair(this.assetPair));

        this.loading--;

        EventHelper.emitEvent(this.element, 'load');
    }
}
