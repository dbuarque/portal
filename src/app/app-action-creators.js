/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {StellarServer} from 'resources';

const {UPDATE_KEYPAIR, UPDATE_ACCOUNT} = appActionTypes;

@inject(StellarServer)
export class AppActionCreators {
    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    updateIdentity(keyPair) {
        return async (dispatch, getState) => {
            dispatch(this.updateKeyPair(keyPair));

            const account = keyPair ? await this.stellarServer.loadAccount(keyPair.publicKey()) : undefined;

            dispatch(this.updateAccount(account));
        };
    }

    updateKeyPair(keyPair) {
        return {
            type: UPDATE_KEYPAIR,
            payload: {
                keyPair
            }
        };
    }

    updateAccount(account) {
        return {
            type: UPDATE_ACCOUNT,
            payload: {
                account
            }
        };
    }
}
