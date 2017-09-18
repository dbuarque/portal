/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {AccountResource} from 'app-resources';
import {DetailActionCreators} from './detail-action-creators';

@inject(Store, AccountResource, DetailActionCreators)
export class MyAssetPairUpdater {

    @connected('exchange.assetPair')
    assetPair;

    @connected('account')
    account;

    constructor(store, accountResource, detailActionCreators) {
        this.store = store;
        this.marketResource = accountResource;
        this.detailActionCreators = detailActionCreators;
    }

    init() {
        this.bind();
    }

    assetPairChanged() {
        this.restart();
    }

    accountChanged(){
        this.restart();
    }
    
    restart() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        if (this.assetPair && this.account) {
            this.interval = setInterval(this.updateBalances.bind(this), 60 * 1000);
            this.updateBalances();
        }
    }

    async updateBalances() {
        this.store.dispatch(this.detailActionCreators.updateMyAssetPair());
    }
}
