import {inject} from 'aurelia-framework';
import {actionCreator} from "au-redux";
import {AccountResource} from '../resources/crud/resources';
import {UPDATE_MY_ACCOUNT_ID, UPDATE_MY_ACCOUNT} from '../app.action-types';

@actionCreator()
@inject(AccountResource)
export class UpdateAccountActionCreator {
    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    /**
     *
     * @param publicKey Account public key
     * @param [options]
     * @param [options.force] Force an update (even if the same account is already loaded in the store)
     * @returns {function(*, *)}
     */
    create(publicKey, options = {}) {
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
                return dispatch(this.create());
            }
        };
    }
}
