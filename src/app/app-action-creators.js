/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {StellarServer} from 'resources';

const {UPDATE_ACCOUNT} = appActionTypes;

@inject(StellarServer)
export class AppActionCreators {
    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    updateAccount(publicKey) {
        return async (dispatch, getState) => {
            const account = publicKey ? await this.stellarServer.loadAccount(publicKey) : undefined;

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account
                }
            });
        };
    }
}
