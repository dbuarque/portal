/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {AccountResource} from 'app-resources';
import {DetailActionCreators} from './detail-action-creators';

@inject(Store, AccountResource, DetailActionCreators)
export class MyOffersUpdater {

    @connected('exchange.assetPair')
    assetPair;

    @connected('myAccount')
    account;

    constructor(store, accountResource, detailActionCreators) {
        this.store = store;
        this.marketResource = accountResource;
        this.detailActionCreators = detailActionCreators;
    }

    init() {
        //calling bind, connects the connected properties
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

        if (!this.assetPair || !this.account || !this.account.flags) {
            return;
        }

        this.interval = setInterval(this.updateMyOffers.bind(this), 60 * 1000);
        this.updateMyOffers();
    }

    async updateMyOffers() {
        this.store.dispatch(this.detailActionCreators.updateMyOffers());
    }
}
