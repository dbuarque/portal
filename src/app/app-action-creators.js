/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {AlertToaster} from 'global-resources';
import {AccountResource} from './resources/crud/resources';

const {UPDATE_MY_ACCOUNT, UPDATE_MY_ACCOUNT_ID, UPDATE_LUPOEX_ACCOUNT, UPDATE_MY_ACCOUNT_SEQNUM} = appActionTypes;

@inject(AlertToaster, AccountResource)
export class AppActionCreators {
    constructor(alertToaster, accountResource) {
        this.alertToaster = alertToaster;
        this.accountResource = accountResource;
    }

    /**
     *
     * @param publicKey Account public key
     * @param [options]
     * @param [options.force] Force an update (even if the same account is already loaded in the store)
     * @returns {function(*, *)}
     */
    updateAccount(publicKey, options = {}) {
        return async (dispatch, getState) => {
            if (!publicKey) {
                dispatch({
                    type: UPDATE_MY_ACCOUNT_ID,
                    payload: publicKey
                });

                return dispatch({
                    type: UPDATE_MY_ACCOUNT
                });
            }

            if (getState().myAccount && getState().myAccount.accountId === publicKey && !options.force) {
                return;
            }

            dispatch({
                type: UPDATE_MY_ACCOUNT_ID,
                payload: publicKey
            });

            try {
                const account = await this.accountResource.account(publicKey, {
                    handleError: false
                });

                return dispatch({
                    type: UPDATE_MY_ACCOUNT,
                    payload: account
                });
            }
            catch(e) {
                //Couldn't find account, let's logout.
                return dispatch(this.updateAccount());
            }
        };
    }

    updateMySeqnum() {
        return async (dispatch, getState) => {
            const state = getState();
            if (!state.myAccount) {
                throw new Error('Cannot update the seqnum without an account in the store.');
            }

            try {
                const data = await this.accountResource.seqnum(state.myAccount.accountId);

                return dispatch({
                    type: UPDATE_MY_ACCOUNT_SEQNUM,
                    payload: data.seqNum
                });
            }
            catch(e) {
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
                this.alertToaster.networkError();
                throw e;
            }

            return dispatch({
                type: UPDATE_LUPOEX_ACCOUNT,
                payload: account
            });
        };
    }
}
