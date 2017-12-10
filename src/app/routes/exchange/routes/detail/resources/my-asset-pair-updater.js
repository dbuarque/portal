/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AccountResource, AccountStream, assetPairsAreDifferent, accountsAreDifferent} from 'app-resources';
import {UpdateMyAssetPairActionCreator} from '../action-creators';

@inject(AccountResource, AccountStream, UpdateMyAssetPairActionCreator)
export class MyAssetPairUpdater {
    @connected('exchange.assetPair')
    assetPair;

    @connected('myAccount')
    account;

    constructor(accountResource, accountStream, updateMyAssetPair) {
        this.marketResource = accountResource;
        this.accountStream = accountStream;
        this.updateMyAssetPair = updateMyAssetPair;
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

        if (!this.assetPair || !this.account) {
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

        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
            this.unsubscribeFromStream = undefined;
        }
    }

    _start() {
        this.previousAccount = this.account;
        this.previousAssetPair = this.assetPair;

        this.unsubscribeFromStream = this.accountStream.subscribe(this._handleAccountEffects.bind(this));
        this.interval = setInterval(this.updateMyAssetPair.dispatch.bind(this.updateMyAssetPair), 60 * 1000);
        this.updateMyAssetPair.dispatch();
    }

    _handleAccountEffects(msg) {
        if (msg.type !== 'effects') {
            return;
        }

        for (let i = 0; i < msg.payload.length; i++) {
            // If a trade or trustline modification comes through, just call restart() which will update myAssetPair and restard the autoupdate interval.
            if (msg.payload[i].type === 'TRADE' || msg.payload[i].type.indexOf('TRUSTLINE') > -1) {
                this.restart();
                return;
            }
        }
    }
}
