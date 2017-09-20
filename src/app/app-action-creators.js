/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {AlertToaster} from 'global-resources';
import {AccountResource} from './resources/crud/resources';

const {UPDATE_ACCOUNT, UPDATE_LUPOEX_ACCOUNT} = appActionTypes;

@inject(AlertToaster, AccountResource)
export class AppActionCreators {
    constructor(alertToaster, accountResource) {
        this.alertToaster = alertToaster;
        this.accountResource = accountResource;
    }

    updateAccount(publicKey) {
        return async (dispatch, getState) => {
            if (!publicKey) {
                return dispatch({
                    type: UPDATE_ACCOUNT,
                    payload: {}
                });
            }

            try {
                const account = await this.accountResource.account(publicKey);

                return dispatch({
                    type: UPDATE_ACCOUNT,
                    payload: account
                });
            }
            catch(e) {
                //Couldn't find account, let's logout.
                dispatch(this.updateAccount());
                throw e;
            }
        };
    }

    updateLupoexAccount() {
        return async (dispatch, getState) => {
            let account;
            try {
                account = await this.accountResource.account(window.lupoex.publicKey);
            }
            catch(e) {
                this.alertToaster.error('Something is wrong. Do you have an internet connection?');
                throw e;
            }

            return dispatch({
                type: UPDATE_LUPOEX_ACCOUNT,
                payload: account
            });
        };
    }
}
