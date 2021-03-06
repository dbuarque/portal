import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {actionCreator} from 'aurelia-redux-connect';
import {AccountResource} from '../resources/crud/resources';
import {UPDATE_MY_ACCOUNT} from '../app.action-types';

const emptyAccount = {
    _balance: '0',
    _flags: 0,
    _thresholds: null,
    balance: '0',
    flags: {},
    homeDomain: null,
    inflationDest: null,
    lastModified: null,
    numSubentries: 0,
    seqNum: null,
    thresholds: {},
    otherSigners: []
};

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
            // Let's synchronously update the account (or remove the account)
            if (!publicKey) {
                dispatch({
                    type: UPDATE_MY_ACCOUNT,
                    payload: null
                });

                localStorage.removeItem('account-id');

                if (this.router.currentInstruction && this.router.currentInstruction.config.accountRequired) {
                    this.router.navigate('/');
                }
            }
            else {
                dispatch({
                    type: UPDATE_MY_ACCOUNT,
                    payload: {
                        ...emptyAccount,
                        accountId: publicKey
                    }
                });

                localStorage.setItem('account-id', publicKey);

                try {
                    const account = await this.accountResource.account(publicKey, {
                        handleError: false
                    });

                    dispatch({
                        type: UPDATE_MY_ACCOUNT,
                        payload: account
                    });

                    return account;
                }
                catch (e) {
                    // Couldn't find account. We want to logout so let's just leave the account null.
                }
            }
        };
    }
}
