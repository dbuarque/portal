/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {StellarServer, AlertToaster} from 'global-resources';

const {UPDATE_ACCOUNT, UPDATE_LUPOEX_ACCOUNT, UPDATE_OFFERS} = appActionTypes;

@inject(StellarServer, AlertToaster)
export class AppActionCreators {
    constructor(stellarServer, alertToaster) {
        this.stellarServer = stellarServer;
        this.alertToaster = alertToaster;
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

            try {
                account = await this.stellarServer.loadAccount(publicKey);
            }
            catch(e) {
                //Couldn't find account, let's logout.
                dispatch(this.setAccount());
                throw e;
            }

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

    updateLupoexAccount() {
        return async (dispatch, getState) => {
            let account;
            try {
                account = await this.stellarServer.loadAccount(window.lupoex.publicKey);
            }
            catch(e) {
                this.alertToaster.error('Something is wrong. Do you have an internet connection?');
                throw e;
            }

            dispatch({
                type: UPDATE_LUPOEX_ACCOUNT,
                payload: {
                    account
                }
            });

            return account;
        };
    }
}
