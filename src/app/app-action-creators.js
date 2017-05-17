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
            if (!publicKey) {
                dispatch({
                    type: UPDATE_ACCOUNT,
                    payload: {
                        account: undefined
                    }
                });
                return;
            }

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

            account = await this.stellarServer.loadAccount(publicKey);

            if (account) {
                account.updating = false;
            }

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account
                }
            });

            return account;
        };
    }

    updateAccount() {
        return (dispatch, getState) => {
            const account = getState().account;

            if (!account) {
                return;
            }

            return dispatch(this.setAccount(account.id));
        }
    }
}
