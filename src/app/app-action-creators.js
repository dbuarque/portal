/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {StellarServer} from 'global-resources';

const {UPDATE_ACCOUNT} = appActionTypes;

@inject(StellarServer)
export class AppActionCreators {
    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    setAccount(publicKey) {
        return async (dispatch, getState) => {
            let account = getState().account;

            account = account || {id: publicKey};

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account: {
                        ...account,
                        updating: true
                    }
                }
            });

            account = publicKey ? await this.stellarServer.loadAccount(publicKey) : undefined;

            if (account) {
                account.updating = false;
            }

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account
                }
            });
        };
    }

    updateAccount() {
        return (dispatch, getState) => {
            const account = getState().account;

            if (!account) {
                return;
            }

            dispatch(this.setAccount(account.id));
        }
    }
}
