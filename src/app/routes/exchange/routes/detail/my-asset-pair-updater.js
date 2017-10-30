/**
 * Created by istrauss on 9/10/2017.
 */

import {inject} from 'aurelia-framework';
import {connected, Store} from 'au-redux';
import {AccountResource} from 'app-resources';
import {AccountStream} from '../../../../account-stream';
import {DetailActionCreators} from './detail-action-creators';

@inject(Store, AccountResource, AccountStream, DetailActionCreators)
export class MyAssetPairUpdater {

    @connected('exchange.assetPair')
    assetPair;

    @connected('myAccount')
    account;

    constructor(store, accountResource, accountStream, detailActionCreators) {
        this.store = store;
        this.marketResource = accountResource;
        this.accountStream = accountStream;
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

        if (this.unsubscribeFromStream) {
            this.unsubscribeFromStream();
        }

        if (!this.assetPair || !this.account) {
            return;
        }

        this.unsubscribeFromStream = this.accountStream.subscribe(this._handleAccountEffects.bind(this));
        this.interval = setInterval(this.updateMyAssetPair.bind(this), 60 * 1000);
        this.updateMyAssetPair();
    }

    _handleAccountEffects(msg) {
        if (msg.type !== 'effects') {
            return;
        }

        for(let i = 0; i < msg.payload.length; i++) {
            // If a trade or trustline modification comes through, just call restart() which will update myAssetPair and restard the autoupdate interval.
            if (msg.payload[i].type === 'TRADE' || msg.payload[i].type.indexOf('TRUSTLINE') > -1) {
                this.restart();
                return;
            }
        }
    }

    async updateMyAssetPair() {
        this.store.dispatch(this.detailActionCreators.updateMyAssetPair());
    }
}
