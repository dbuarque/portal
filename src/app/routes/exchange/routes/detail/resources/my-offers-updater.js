/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountResource} from 'app-resources';
import {UpdateMyOffersActionCreator} from '../action-creators';

@inject(AccountResource, UpdateMyOffersActionCreator)
export class MyOffersUpdater {

    @connected('exchange.assetPair')
    assetPair;

    @connected('myAccount')
    account;

    constructor(accountResource, updateMyOffers) {
        this.marketResource = accountResource;
        this.updateMyOffers = updateMyOffers;
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

        this.interval = setInterval(this.updateMyOffers.dispatch.bind(this.updateMyOffers), 60 * 1000);
        this.updateMyOffers.dispatch();
    }
}
