import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {actionCreator} from 'aurelia-redux-connect';
import {AccountResource} from '../resources/crud/resources';
import {UPDATE_MY_ACCOUNT_ID, UPDATE_MY_ACCOUNT} from '../app.action-types';

@actionCreator()
@inject(Router, AccountResource)
export class UpdateAccountActionCreator {
    constructor(router, accountResource) {
        this.router = router;
        this.accountResource = accountResource;
    }

    initFromStore() {
        this.dispatch(
            localStorage.getItem('account-id')
        );
    }

    /**
     *
     * @param publicKey Account public key
     * @param [options]
     * @param [options.force] Force an update (even if the same account is already loaded in the store)
     * @returns {function(*, *)}
     */
    create(publicKey, options = {}) {
        return async(dispatch, getState) => {
            if (getState().myAccount && getState().myAccount.accountId === publicKey && !options.force) {
                return;
            }

            // There are times (especially on app startup) that we need an accountId in the store synchronously.
            dispatch({
                type: UPDATE_MY_ACCOUNT_ID,
                payload: publicKey
            });

            let account = null;

            if (publicKey) {
                try {
                    account = await this.accountResource.account(publicKey, {
                        handleError: false
                    });
                }
                catch (e) {
                    // Couldn't find account. We want to logout so let's just leave the account null.
                }
            }

            dispatch({
                type: UPDATE_MY_ACCOUNT,
                payload: account
            });

            account && account.accountId ?
                localStorage.setItem('account-id', account.accountId) :
                localStorage.removeItem('account-id');

            if (!account && this.router.currentInstruction.config.accountRequired) {
                this.router.navigate('/');
            }

            return account;
        };
    }
}
