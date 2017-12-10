/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountResource, assetPairsAreDifferent, accountsAreDifferent} from 'app-resources';
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
        this._start();
    }

    deinit() {
        this._stop();
        this.unbind();
    }

    assetPairChanged() {
        this.restart();
    }

    accountChanged() {
        this.restart();
    }

    restart() {
        if (
            !assetPairsAreDifferent(this.assetPair, this.previousAssetPair) &&
            !accountsAreDifferent(this.account, this.previousAccount)
        ) {
            return;
        }

        this._stop();

        if (!this.assetPair || !this.account || !this.account.flags) {
            return;
        }

        this._start();
    }

    _stop() {
        this.previousAccount = undefined;
        this.previousAssetPair = undefined;

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    _start() {
        this.previousAccount = this.account;
        this.previousAssetPair = this.assetPair;

        this.interval = setInterval(this.updateMyOffers.dispatch.bind(this.updateMyOffers), 60 * 1000);
        this.updateMyOffers.dispatch();
    }
}
