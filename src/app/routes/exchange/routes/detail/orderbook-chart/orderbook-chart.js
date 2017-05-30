/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';

@inject(AppStore)
export class OrderbookChart {

    constructor(appStore) {
        this.appStore = appStore;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
    }
}
